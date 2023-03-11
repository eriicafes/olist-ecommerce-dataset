const { config } = require('./config')
const { app } = require('./app')
const { db } = require('./lib/db')

async function start () {
  await db.connect().then(() => [
    console.log('db connected succesfully')
  ])

  app.listen(config.PORT, () => {
    console.log(`app is running on port ${config.PORT}`)
  })
}

start()
