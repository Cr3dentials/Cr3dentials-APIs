// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const {Client} = require("pg")
const axios = require("axios")
async function generateBasicAuthToken(username, password) {
  try {
    const response = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/token/",
      {
        username: username,
        password: password,
      }
    )

    if (response.status === 200) {
      return response.data.access_token
    } else {
      throw new Error("Failed to obtain access token")
    }
  } catch (error) {
    throw new Error("Authentication failed: " + error.message)
  }
}
exports.requestToPay = async (event, context) => {
  const data = JSON.parse(event.body)

  const requiredHeaders = [
    "X-Reference-Id",
    "X-Target-Environment",
    "Content-Type",
    "Cache-Control",
    "Ocp-Apim-Subscription-Key",
  ]
  for (const header of requiredHeaders) {
    if (!event.headers[header]) {
      throw new Error(`Missing required header: ${header}`)
    }
  }
  const authHeader = event.headers["Authorization"]
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    throw new Error("Authorization header is missing or invalid")
  }

  const encodedCreds = authHeader.split(" ")[1]
  const decodedCreds = Buffer.from(encodedCreds, "base64").toString("utf-8")
  const [username, password] = decodedCreds.split(":")
  // Validate request body
  if (!event.body) {
    throw new Error("Request body is missing")
  }
  const token = generateBasicAuthToken(username, password)
  const headers = {
    "X-Reference-Id": event.headers["X-Reference-Id"],
    "X-Target-Environment": event.headers["X-Target-Environment"],
    "Content-Type": event.headers["Content-Type"],
    "Cache-Control": event.headers["Cache-Control"],
    "Ocp-Apim-Subscription-Key": event.headers["Ocp-Apim-Subscription-Key"],
    Authorization: `Bearer ${token}`,
  }

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
    headers: headers,
    data: data,
  }

  try {
    const response = await axios.request(config)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: response.data,
      }),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({
        error: error.message || "Internal Server Error",
      }),
    }
  }
}
