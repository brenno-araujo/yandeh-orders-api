import { APIGatewayProxyHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';
import { formatJSONResponse } from '../helpers/format-json-response';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    dotenv.config();
    console.log('event', event);
    const body = JSON.parse(event.body || '{}');
    const controller = new OrderController();
    const response = await controller.createOrder(body);
    return formatJSONResponse(response.statusCode, response.body);
  } catch (error) {
    console.error('Failed to create order:', error);
    return formatJSONResponse(500, { error: 'Failed to create order' });
  }
  
};
