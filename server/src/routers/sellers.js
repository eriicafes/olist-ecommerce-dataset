const { Router } = require('express')
const services = require('../services')

const router = Router()

router.get('/sellers', async (req, res, next) => {
  try {
    const result = await services.sellers.getAll({
      offset: req.query.offset,
      limit: req.query.limit
    })

    return res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = { sellersRouter: router }
