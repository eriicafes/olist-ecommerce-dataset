const express = require("express")
const { router } = require("./router")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        ping: "pong",
    })
})

app.use(router)

module.exports = { app }
