const { db, collections } = require("./lib/db")
const { parsePaginationParams } = require("./utils")

const sellers = {
    async getOne({ seller_id, seller_zip_code_prefix }) {
        const result = await db.collection(collections.sellers).findOne({
            seller_id,
            seller_zip_code_prefix,
        })
        if (!result) return null

        return {
            seller_id: result.seller_id,
            seller_zip_code_prefix: result.seller_zip_code_prefix,
            seller_city: result.seller_city,
            seller_state: result.seller_state,
        }
    },
}

const orderItems = {
    async getAll({ seller_id, offset, limit, sort }) {
        const page = parsePaginationParams({ offset, limit, sort }, { sortFields: ["price", "date"] })

        const count = db.collection(collections.orderItems).countDocuments({
            seller_id,
        })

        let cursor = db.collection(collections.orderItems).aggregate([
            { $match: { seller_id } },
            { $lookup: {
                from: collections.products,
                localField: "product_id",
                foreignField: "product_id",
                as: "product",
            }},
            { $addFields: { 
                id: "$order_item_id",
                date: "$shipping_limit_date",
                product_category: { $first: "$product.product_category_name" },
            }},
            { $project: { 
                _id: 0,
                id: 1,
                product_id: 1,
                product_category: 1,
                price: 1,
                date: 1,
            }},

            // conditionally sort items before skip and limit
            ...(page.sort ? [{ $sort: { [page.sort.field]: page.sort.order } }] : []),

            { $skip: page.skip },
            { $limit: page.limit },
        ])

        const [total, result] = await Promise.all([count, cursor.toArray()])

        return  {
            total,
            data: result,
            limit: page.limit,
            offset: page.offset,
        }
    },
}

module.exports = {
    sellers,
    orderItems,
}
