import { APIGatewayProxyHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';

export const handler: APIGatewayProxyHandler = async (event) => {
  const orderId = event.pathParameters?.id || '';
  const body = JSON.parse(event.body || '{}');
  const controller = new OrderController();
  const response = await controller.updateOrderStatus(orderId, body);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
