const { Router } = require('express')
const { authorize } = require('../middlewares/auth')
const services = require('../services')

const router = Router()

// apply middlewares
router.use(authorize)

router.get('/account', async (req, res) => {
  res.json({
    data: req.user
  })
})

router.put('/account', async (req, res, next) => {
  try {
    await services.sellers.updateOne({
      seller_id: req.user.seller_id,
      seller_city: req.body.seller_city,
      seller_state: req.body.seller_state
    })

    res.status(200).json({
      data: {
        seller_city: req.body.seller_city,
        seller_state: req.body.seller_state
      }
    })
  } catch (err) {
    next(err)
  }
})

module.exports = { accountRouter: router }
