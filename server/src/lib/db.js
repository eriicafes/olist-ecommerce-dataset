const { MongoClient } = require('mongodb')
const { config } = require('../config')

/** @type {import("mongodb").MongoClient} */
let client
/**  @type {import("mongodb").Db} */
let dbInstance
/** @type {import("mongodb-memory-server").MongoMemoryServer | undefined} */
let mongod

const db = {
  instance () {
    return dbInstance
  },

  async connect () {
    let uri = config.MONGO_URI

    // use in memory db uri in tests
    if (process.env.NODE_ENV === 'test') {
      const { MongoMemoryServer } = require('mongodb-memory-server')
      mongod = await MongoMemoryServer.create()

      uri = mongod.getUri()
    }

    client = new MongoClient(uri)
    dbInstance = client.db('olist-ecommerce-dataset')

    return client.connect()
  },

  async close () {
    if (mongod) await mongod.stop()

    return client.close()
  },

  async dropCollections () {
    const collections = await db.instance().collections()

    for (const collection of collections) {
      await collection.deleteMany()
    }
  }
}

const collections = {
  sellers: 'sellers',
  products: 'products',
  orderItems: 'order_items'
}

module.exports = { db, collections }
