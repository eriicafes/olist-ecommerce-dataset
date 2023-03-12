const { app } = require("../../src/app");
const { db } = require("../../src/lib/db");
const serverless = require("serverless-http");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await db.connect().then(() => [
    console.log('db connected succesfully')
  ])

  return handler(event, context);
};
