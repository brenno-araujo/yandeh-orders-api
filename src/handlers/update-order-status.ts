import { APIGatewayProxyHandler } from 'aws-lambda';
import { UpdateStatusController } from '../controllers/update-status.controller';
import { formatJSONResponse } from '../helpers/format-json-response';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  dotenv.config();
  try {
    const orderId = event.pathParameters?.id || '';
    const body = JSON.parse(event.body || '{}');
    const controller = new UpdateStatusController();
    const response = await controller.execute(orderId, body);
    return formatJSONResponse(response.statusCode, response.body);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return formatJSONResponse(500, { error: 'Failed to update order status' });
  }
  
};
