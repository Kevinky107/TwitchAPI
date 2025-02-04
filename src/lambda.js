const { app } = require('./app');
const serverless = require("serverless-http");

const handler = serverless(app, {
	response: { headers: { 'Access-Control-Allow-Origin': '*' } }
})

module.exports.handler = handler;