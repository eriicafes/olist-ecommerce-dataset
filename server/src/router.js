const { Router } = require("express")
const { authorize } = require("./middlewares/auth")

const router = Router()

// apply middlewares
router.use(authorize)

router.get("/account", (req, res) => {
    res.send(req.user)
})

module.exports = { router }
