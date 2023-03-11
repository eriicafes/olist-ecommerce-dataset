require('dotenv').config()

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/olist-ecommerce-dataset'
}

module.exports = { config }
