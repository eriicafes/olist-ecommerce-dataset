const { Router } = require('express')
const { authorize } = require('../middlewares/auth')
const services = require('../services')

const router = Router()

// apply middlewares
router.use(authorize)

router.get('/order_items', async (req, res, next) => {
  try {
    const result = await services.orderItems.getAll({
      seller_id: req.user.seller_id,
      offset: req.query.offset,
      limit: req.query.limit,
      sort: req.query.sort
    })

    return res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/order_items/:id', async (req, res, next) => {
  try {
    const result = await services.orderItems.getOne({
      seller_id: req.user.seller_id,
      id: req.params.id
    })

    if (!result) {
      return res.status(404).send({
        status: 404,
        error: 'Not found'
      })
    }

    res.status(200).json({
      data: result
    })
  } catch (err) {
    next(err)
  }
})

router.put('/order_items/:id', async (req, res, next) => {
  try {
    const { modifiedCount } = await services.orderItems.updateOne({
      seller_id: req.user.seller_id,
      id: req.params.id,
      price: req.body.price,
      date: req.body.date
    })

    if (!modifiedCount) {
      return res.send(404).json({
        status: 404,
        error: 'Not found'
      })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

router.delete('/order_items/:id', async (req, res, next) => {
  try {
    const { deletedCount } = await services.orderItems.deleteOne({
      seller_id: req.user.seller_id,
      id: req.params.id
    })

    if (!deletedCount) {
      return res.send(404).json({
        status: 404,
        error: 'Not found'
      })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = { orderItemsRouter: router }
