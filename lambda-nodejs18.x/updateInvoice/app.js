exports.updateInvoice = async (event, context) => {
  const invoiceId = event.pathParameters.invoiceId

  const requestBody = JSON.parse(event.body)

  try {
    const client = new Client({
      user: "postgres",
      host: "http://database-1.ctppflvfb7pt.us-east-1.rds.amazonaws.com/",
      database: "invoice_factory",
      password: "cr3dentials",
      port: 5432,
    })

    await client.connect()

    const query = `
      UPDATE invoices
      SET payer_address = $1,
          payee_address = $2,
          amount = $3,
          fee = $4,
          due_date = $5,
          status = $6,
          approvals = $7
      WHERE invoice_id = $8
      RETURNING *;
    `

    const result = await client.query(query, [
      requestBody.payer_address,
      requestBody.payee_address,
      requestBody.amount,
      requestBody.fee,
      requestBody.due_date,
      requestBody.status,
      requestBody.approvals,
      invoiceId,
    ])

    console.log("Invoice updated:", result.rows[0])

    // await client.end()

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    }
  } catch (error) {
    console.error("Error updating invoice:", error)
    return {
      statusCode: 500,
      body: JSON.stringify("Error updating invoice"),
    }
  } finally {
    await client.end() // Close the database connection
  }
}
