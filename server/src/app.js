const express = require('express')
const cors = require('cors')
const { accountRouter } = require('./routers/account')
const { orderItemsRouter } = require('./routers/order-items')
const { sellersRouter } = require('./routers/sellers')

const app = express()

app.use(express.json())
app.use(cors())

// mount routers
app.use(sellersRouter)
app.use(accountRouter)
app.use(orderItemsRouter)

// not found route
app.use((_req, res, _next) => {
  res.send({
    status: 404,
    error: 'Not found'
  })
})

// error fallback
app.use((err, _req, res, _next) => {
  console.log('application error:', err)

  res.status(500).send({
    status: 500,
    error: 'Something went wrong'
  })
})

module.exports = { app }
