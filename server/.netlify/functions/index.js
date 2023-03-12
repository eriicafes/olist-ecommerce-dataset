const { app } = require("../../src/app");
const serverless = require("serverless-http");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return handler(event, context);
};
