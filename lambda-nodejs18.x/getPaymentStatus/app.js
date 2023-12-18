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

exports.getPayementStatus = async (event, context) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://sandbox.momodeveloper.mtn.com/collection/v2_0/payment/18554d82-b962-44d8-b297-c96ee99aae4c?x-referenceId=18554d82-b962-44d8-b297-c96ee99aae4c",
    headers: {
      "X-Target-Environment": "sandbox",
      "Ocp-Apim-Subscription-Key": "9bbb101ccabf498682a1e62496e7e568",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6IjNmNTJkYTRkLWFjODMtNDVjNy1iYTFlLTZhOWQyNzBlMTU0OCIsImV4cGlyZXMiOiIyMDIzLTEyLTE2VDIxOjQ0OjQwLjA2NCIsInNlc3Npb25JZCI6ImYxYTgxNDMxLWI2ZTUtNDRmYi04NzQwLWUzYjkyYTIwMGFhYiJ9.UOgMU7bB9UtM-EhJHzFrKJo-3dIRCQzeEsTmpCc04-2iEVwi9v2ic4jaOxMPQrG1hWOuHC724GEjZbOIC4Wld5aJdCoCRyvMJE2Vp5g0ShbSR_b9WJpwPjlqRkyd8xhml27LEIZYudzXCHutqgf8gSEMoN-TkkvUNXwMm4hiEV76SNhWd7PnQ7iup-YUxptBiWRWPnMf2UoBfzMNAhkFd2oEhHBv3xN-NjJ4160pzWHH7QheZryZJUMYE9Who-MCfFWbrQ9mt3lvgHQ5PhazWgw7uG8ez0bG7H0Oywa3FxBU9QFcaDQHuC6GxRggmrQeTZj_TItjbOcDaoAl8D-RVw",
    },
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
