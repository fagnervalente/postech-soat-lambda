// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;
const secret = process.env.SECRET;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const jwt = require('jsonwebtoken');

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.autenticatorHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{cpf}` at template.yaml
  const cpf = event.pathParameters.cpf;
 
  // Get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  let response = {};

  try {
    const params = {
      TableName : tableName,
      Key: { id: cpf },
    };
    const data = await docClient.get(params).promise();
    const item = data.Item;

    if (item != null) {
      const token = jwt.sign(
        { user: JSON.stringify(item) }, 
        secret, 
        { expiresIn: 300 }
      );
     
      response = {
        statusCode: 200,
        body: JSON.stringify({
          auth: true,
          token: token
        })
      };
    } else {
      response = {
        statusCode: 404,
        body: { message: 'Cliente não encontrado!' }
      };
    }
  } catch (ResourceNotFoundException) {
    response = {
        statusCode: 404,
        body: "Unable to call DynamoDB. Table resource not found."
    };
  }
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
