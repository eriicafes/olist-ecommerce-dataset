const express = require("express")
const { router } = require("./router")

const app = express()

app.use(express.json())

// mount routers
app.use(router)

// error fallback
app.use((err, _req, res, _next) => {
    console.log("application error:", err)

    res.send({
        status: 500,
        error: "Something went wrong",
    })
})

module.exports = { app }
