import { APIGatewayProxyHandler } from 'aws-lambda';
import ImportController  from '../controllers/import.controller';
import { formatJSONResponse } from '../helpers/format-json-response';
import dotenv from 'dotenv';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    dotenv.config();
    const controller = new ImportController();
    const response = await controller.execute(event.body);
    return formatJSONResponse(200, response);
  } catch (error) {
    console.error(error);
    return formatJSONResponse(500, { error: 'Failed to import orders' });
  }
  
};
