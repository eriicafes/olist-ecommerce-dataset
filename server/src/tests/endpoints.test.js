const request = require('supertest')
const { app } = require('../app')
const { db, collections } = require('../lib/db')

beforeAll(db.connect)
afterAll(db.close)

const req = request(app)

describe('get and modify account', () => {
  const seller1 = {
    seller_id: 'seller-id-1',
    seller_zip_code_prefix: 'prefix-1',
    seller_city: 'venice',
    seller_state: 'VC'
  }
  const seller2 = {
    seller_id: 'seller-id-2',
    seller_zip_code_prefix: 'prefix-2',
    seller_city: 'miami',
    seller_state: 'MA'
  }

  beforeAll(async () => {
    await db.instance().collection(collections.sellers).insertMany([seller1, seller2])
  })
  afterAll(db.dropCollections)

  test('GET /account no credentials', async () => {
    const res = await req.get('/account')

    expect(res.statusCode).toBe(401)
    expect(res.body).toStrictEqual({ status: 401, error: 'Missing credentials' })
  })

  test('GET /account malformed credentials', async () => {
    const res = await req.get('/account').set('Authorization', 'Bearer myname:mypass')

    expect(res.statusCode).toBe(401)
    expect(res.body).toStrictEqual({ status: 401, error: 'Malformed credentials' })
  })

  test('GET /account incorrect credentials', async () => {
    const res = await req.get('/account').auth('myname', 'mypass')

    expect(res.statusCode).toBe(401)
    expect(res.body).toStrictEqual({ status: 401, error: 'Incorrect credentials' })
  })

  test('GET /account correct credentials', async () => {
    const res = await req.get('/account').auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.seller_city).toBe('venice')
    expect(res.body.data.seller_state).toBe('VC')
  })

  const newCity = 'trinidad'
  const newState = 'TA'

  test('PUT /account update account', async () => {
    const res = await req.put('/account').auth(seller1.seller_id, seller1.seller_zip_code_prefix).send({
      seller_city: newCity,
      seller_state: newState
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toStrictEqual({ seller_city: newCity, seller_state: newState })
  })

  test('GET /account get account after update', async () => {
    const res = await req.get('/account').auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.seller_city).toBe(newCity)
    expect(res.body.data.seller_state).toBe(newState)
  })
})

describe('get sellers', () => {
  beforeAll(async () => {
    const sellers = [
      {
        seller_id: 'seller-id-1',
        seller_zip_code_prefix: 'prefix-1',
        seller_city: 'venice',
        seller_state: 'VC'
      },
      {
        seller_id: 'seller-id-2',
        seller_zip_code_prefix: 'prefix-2',
        seller_city: 'miami',
        seller_state: 'MA'
      },
      {
        seller_id: 'seller-id-3',
        seller_zip_code_prefix: 'prefix-3',
        seller_city: 'dallas',
        seller_state: 'DA'
      }
    ]

    await db.instance().collection(collections.sellers).insertMany(sellers)
  })
  afterAll(db.dropCollections)

  test('GET /sellers', async () => {
    const res = await req.get('/sellers')

    expect(res.statusCode).toBe(200)
    expect(res.body.total).toBe(3)
    expect(res.body.data.length).toBe(3)
  })

  test('GET /sellers at offset', async () => {
    const res = await req.get('/sellers').query({ offset: 1 })

    expect(res.statusCode).toBe(200)
    expect(res.body.total).toBe(3)
    expect(res.body.data.length).toBe(0)
  })
})

describe('get and modify order items', () => {
  // seed sellers
  const seller1 = {
    seller_id: 'seller-id-1',
    seller_zip_code_prefix: 'prefix-1',
    seller_city: 'venice',
    seller_state: 'VC'
  }
  const seller2 = {
    seller_id: 'seller-id-2',
    seller_zip_code_prefix: 'prefix-2',
    seller_city: 'miami',
    seller_state: 'MA'
  }

  // seed products
  const product1 = {
    product_id: 'product-id-1',
    product_category_name: 'picasso',
    product_name_lenght: 120,
    product_description_lenght: 120,
    product_photos_qty: 120,
    product_weight_g: 120,
    product_length_cm: 120,
    product_height_cm: 120,
    product_width_cm: 120
  }
  const product2 = {
    product_id: 'product-id-2',
    product_category_name: 'lucid',
    product_name_lenght: 200,
    product_description_lenght: 200,
    product_photos_qty: 200,
    product_weight_g: 200,
    product_length_cm: 200,
    product_height_cm: 200,
    product_width_cm: 200
  }

  // seed order items
  const orderItem1 = {
    order_id: 'order-id-1',
    order_item_id: 'order-item-id-1',
    product_id: product1.product_id,
    seller_id: seller1.seller_id,
    shipping_limit_date: new Date('2020-01-01').toISOString(),
    price: 5000,
    freight_value: 100
  }
  const orderItem2 = {
    order_id: 'order-id-2',
    order_item_id: 'order-item-id-2',
    product_id: product1.product_id,
    seller_id: seller2.seller_id,
    shipping_limit_date: new Date('2020-02-01').toISOString(),
    price: 5000,
    freight_value: 100
  }
  const orderItem3 = {
    order_id: 'order-id-3',
    order_item_id: 'order-item-id-3',
    product_id: product2.product_id,
    seller_id: seller1.seller_id,
    shipping_limit_date: new Date('2020-03-01').toISOString(),
    price: 5000,
    freight_value: 100
  }

  beforeAll(async () => {
    await Promise.all([
      db.instance().collection(collections.sellers).insertMany([seller1, seller2]),
      db.instance().collection(collections.products).insertMany([product1, product2]),
      db.instance().collection(collections.orderItems).insertMany([orderItem1, orderItem2, orderItem3])
    ])
  })
  afterAll(db.dropCollections)

  test('GET /order_items get order items for logged in user', async () => {
    const res = await req.get('/order_items').auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(200)
    expect(res.body.total).toBe(2)
    expect(res.body.data.length).toBe(2)
  })

  test('GET /order_items/:id get order item', async () => {
    const res = await req.get(`/order_items/${orderItem1.order_item_id}`).auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.id).toBe(orderItem1.order_item_id)
    expect(res.body.data.price).toBe(orderItem1.price)
    expect(res.body.data.date).toBe(orderItem1.shipping_limit_date)
    // check product info
    expect(res.body.data.product_id).toBe(product1.product_id)
    expect(res.body.data.product_category).toBe(product1.product_category_name)
  })

  test('GET /order_items/:id get order item for another user', async () => {
    const res = await req.get(`/order_items/${orderItem2.order_item_id}`).auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(404)
  })

  const newPrice = 1200
  const newDate = new Date('2021-04-04').toISOString()

  test('PUT /order_items/:id update order item', async () => {
    const res = await req.put(`/order_items/${orderItem1.order_item_id}`)
      .auth(seller1.seller_id, seller1.seller_zip_code_prefix)
      .send({
        price: newPrice,
        date: newDate
      })

    expect(res.statusCode).toBe(204)
  })

  test('GET /order_items/:id get order item after update', async () => {
    const res = await req.get(`/order_items/${orderItem1.order_item_id}`).auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.price).toBe(newPrice)
    expect(res.body.data.date).toBe(newDate)
  })

  test('DELETE /order_items/:id', async () => {
    const res = await req.delete(`/order_items/${orderItem1.order_item_id}`).auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(204)
  })

  test('GET /order_items/:id get order item after delete', async () => {
    const res = await req.get(`/order_items/${orderItem1.order_item_id}`).auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(404)
  })

  test('GET /order_items get order items after delete', async () => {
    const res = await req.get('/order_items').auth(seller1.seller_id, seller1.seller_zip_code_prefix)

    expect(res.statusCode).toBe(200)
    expect(res.body.total).toBe(1)
    expect(res.body.data.length).toBe(1)
  })
})
