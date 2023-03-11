const { MongoClient } = require("mongodb");
const { config } = require("../config");

const client = new MongoClient(config.MONGO_URI);

const db = client.db()

const connectDb = () => client.connect()
const closeDb = () => client.close()

const collections = {
    sellers: "sellers",
    products: "products",
    orderItems: "order_items",
}

module.exports = { connectDb, closeDb, db, collections }
