import { APIGatewayProxyHandler } from 'aws-lambda';
import { CreateController } from '../controllers/create.controller';
import { formatJSONResponse } from '../helpers/format-json-response';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    dotenv.config();
    console.log('event', event);
    const body = JSON.parse(event.body || '{}');
    const controller = new CreateController();
    const response = await controller.execute(body);
    return formatJSONResponse(response.statusCode, response.body);
  } catch (error) {
    console.error('Failed to create order:', error);
    return formatJSONResponse(500, { error: 'Failed to create order' });
  }
  
};
