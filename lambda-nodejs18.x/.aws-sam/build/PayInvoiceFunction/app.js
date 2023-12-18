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

exports.payInvoice = async (event, context) => {
  let data = JSON.stringify({
    amount: "5.0",
    currency: "EUR",
    externalId: "3333",
    payer: {
      partyIdType: "MSISDN",
      partyId: "46733123453",
    },
    payerMessage: "hello",
    payeeNote: "hi",
  })

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
    headers: {
      "X-Reference-Id": "b8e59e4c-5134-4296-85d3-dcd338afddf5",
      "X-Target-Environment": "sandbox",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "Ocp-Apim-Subscription-Key": "9bbb101ccabf498682a1e62496e7e568",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6IjNmNTJkYTRkLWFjODMtNDVjNy1iYTFlLTZhOWQyNzBlMTU0OCIsImV4cGlyZXMiOiIyMDIzLTEyLTE2VDE5OjA4OjU3LjQyNyIsInNlc3Npb25JZCI6ImRjNTRiZTQzLTUwZDAtNDFhMS05MTdlLTYzZTRmOGI2ODA1MiJ9.PQhvbeXbZGtH3nwhJTkKZZT1Ac3LIr7rYdnImCeWLzFPj2OI3BY954g9OdKsPEahicO-8cUD1gX2pyFJ-mhFKF8FAV6s5-uh8frhwVKzMCKOAGU2Fgt3dtxQIxGcGEUGSOoIrcm6whFRCm2HEnWcPwovkG89ny6fiSIkEGny3Rt9nLVUbaA8xlTYaYh31tIC1IT3MbeAqGt_Z-ANTiujd3zpRBs5y_g2G6N819V4slEFiT3S6G9OspP5HRu4cxFX3ABQiR6uq7Q1AWPakLQ0mxy7pLtilBF6bKllYPAwsQTEreBmVahtMCRLz78UU7-Aw2g3C7tfY87bfHd5y3Y1eA", // Replace with your access token
    },
    data: data,
  }

  try {
    const response = await axios.request(config)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "invoice paid",
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
