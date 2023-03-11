/* eslint-disable camelcase */
const { db, collections } = require('./lib/db')
const { parsePaginationParams } = require('./utils')

const sellers = {
  async getOne ({ seller_id }) {
    const result = await db.instance().collection(collections.sellers).findOne({ seller_id })
    if (!result) return null

    return {
      seller_id: result.seller_id,
      seller_zip_code_prefix: result.seller_zip_code_prefix,
      seller_city: result.seller_city,
      seller_state: result.seller_state
    }
  },

  async updateOne ({ seller_id, seller_city, seller_state }) {
    return db.instance().collection(collections.sellers).updateOne({ seller_id }, {
      $set: {
        seller_city,
        seller_state
      }
    })
  },

  async getAll ({ offset, limit }) {
    const page = parsePaginationParams({ offset, limit })

    const count = db.instance().collection(collections.sellers).countDocuments()

    const cursor = db.instance().collection(collections.sellers).find()
      .skip(page.skip)
      .limit(page.limit)
      .map((doc) => ({
        seller_id: doc.seller_id,
        seller_zip_code_prefix: doc.seller_zip_code_prefix,
        seller_city: doc.seller_city,
        seller_state: doc.seller_state
      }))

    const [total, result] = await Promise.all([count, cursor.toArray()])

    return {
      total,
      data: result,
      limit: page.limit,
      offset: page.offset
    }
  }
}

const orderItems = {
  async getOne ({ seller_id, id }) {
    const result = await db.instance().collection(collections.orderItems).findOne({
      seller_id,
      order_item_id: id
    })
    if (!result) return null

    const product = await db.instance().collection(collections.products).findOne({ product_id: result.product_id })

    return {
      id: result.order_item_id,
      product_id: result.product_id,
      product_category: product.product_category_name,
      price: result.price,
      date: result.shipping_limit_date
    }
  },

  async updateOne ({ seller_id, id, price, date }) {
    return db.instance().collection(collections.orderItems).updateOne({
      seller_id,
      order_item_id: id
    }, {
      $set: {
        price,
        shipping_limit_date: date
      }
    })
  },

  async deleteOne ({ seller_id, id }) {
    return db.instance().collection(collections.orderItems).deleteOne({
      seller_id,
      order_item_id: id
    })
  },

  async getAll ({ seller_id, offset, limit, sort }) {
    const page = parsePaginationParams({ offset, limit, sort }, { sortFields: ['price', 'date'] })

    const count = db.instance().collection(collections.orderItems).countDocuments({
      seller_id
    })

    const cursor = db.instance().collection(collections.orderItems).aggregate([
      { $match: { seller_id } },
      {
        $lookup: {
          from: collections.products,
          localField: 'product_id',
          foreignField: 'product_id',
          as: 'product'
        }
      },
      {
        $addFields: {
          id: '$order_item_id',
          date: '$shipping_limit_date',
          product_category: { $first: '$product.product_category_name' }
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          product_id: 1,
          product_category: 1,
          price: 1,
          date: 1
        }
      },

      // conditionally sort items before skip and limit
      ...(page.sort ? [{ $sort: { [page.sort.field]: page.sort.order } }] : []),

      { $skip: page.skip },
      { $limit: page.limit }
    ])

    const [total, result] = await Promise.all([count, cursor.toArray()])

    return {
      total,
      data: result,
      limit: page.limit,
      offset: page.offset
    }
  }
}

module.exports = {
  sellers,
  orderItems
}
