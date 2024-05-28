import { APIGatewayProxyHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('event', event);
  const body = JSON.parse(event.body || '{}');
  const controller = new OrderController();
  const response = await controller.createOrder(body);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
