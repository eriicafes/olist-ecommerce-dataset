const { config } = require("./config")
const { app } = require("./app")
const { connectDb } = require("./lib/db")

async function start() {
    await connectDb().then(() => [
        console.log("db connected succesfully")
    ])

    app.listen(config.PORT, () => {
        console.log(`app is running on port ${config.PORT}`)
    })
}

start()
