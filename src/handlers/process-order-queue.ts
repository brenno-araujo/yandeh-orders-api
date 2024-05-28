import { SQSEvent, SQSHandler } from 'aws-lambda';
import { OrderController } from '../controllers/order.controller';

export const handler: SQSHandler = async (event: SQSEvent) => {
  const controller = new OrderController();

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    await controller.processOrder(body);
  }
};
