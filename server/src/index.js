const { config } = require("./config")
const { app } = require("./app")

function start() {
    app.listen(config.PORT, () => {
        console.log(`app is running on port ${config.PORT}`)
    })
}

start()
