import { SQSEvent, SQSHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';
import dotenv from 'dotenv';

export const handler: SQSHandler = async (event: SQSEvent) => {
  dotenv.config();
  const controller = new OrderController();

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    await controller.processOrder(body);
  }
};
