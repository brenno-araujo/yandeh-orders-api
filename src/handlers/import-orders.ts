import { APIGatewayProxyHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';
export const handler: APIGatewayProxyHandler = async (event) => {
  const controller = new OrderController();
  const response = await controller.importOrders(event);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
