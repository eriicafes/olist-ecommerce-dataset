const { Router } = require("express")
const { authorize } = require("./middlewares/auth")
const services = require("./services")

const router = Router()

// apply middlewares
router.use(authorize)

router.get("/account", (req, res) => {
    res.send(req.user)
})

router.get("/order_items", async (req, res, next) => {
    try {
        const orderItems = await services.orderItems.getAll({
            seller_id: req.user.seller_id,
            offset: req.query.offset,
            limit: req.query.limit,
            sort: req.query.sort,
        })

        return res.json(orderItems)
    } catch (err) {
        next(err)
    }
})

module.exports = { router }
