import { APIGatewayProxyHandler } from 'aws-lambda';
import { FindController } from '../controllers/find.controller';
import { formatJSONResponse } from '../helpers/format-json-response';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  dotenv.config();
  try {
    if (!event.queryStringParameters) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing query string parameters' }),
      }
    }

    const queryStringParameters = event.queryStringParameters || {};
    const controller = new FindController();
    const response = await controller.execute(queryStringParameters);
    return formatJSONResponse(200, response);
  } catch (error) {
    console.error('Failed to get order:', error);
    return formatJSONResponse(500, { error: 'Failed to get order' });
  }
};
