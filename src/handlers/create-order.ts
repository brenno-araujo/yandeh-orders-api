import { APIGatewayProxyHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  dotenv.config();
  console.log('event', event);
  const body = JSON.parse(event.body || '{}');
  const controller = new OrderController();
  const response = await controller.createOrder(body);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
