import { APIGatewayProxyHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  dotenv.config();
  const queryStringParameters = event.queryStringParameters || {};
  const controller = new OrderController();
  const response = await controller.getOrder(queryStringParameters);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
