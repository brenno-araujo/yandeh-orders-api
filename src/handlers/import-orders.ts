import { APIGatewayProxyHandler } from 'aws-lambda';
import ImportController  from '../controllers/import.controller';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  dotenv.config();
  const controller = new ImportController();
  const response = await controller.execute(event.body);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
