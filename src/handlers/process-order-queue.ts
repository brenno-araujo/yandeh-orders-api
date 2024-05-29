import { SQSHandler, SQSEvent } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { ProcessOrderController } from '../controllers/process-order.controller';

dotenv.config();

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log('Processando mensagem da fila');
  const controller = new ProcessOrderController();

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      await controller.execute(body);
    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
      // Re-throw the error to ensure the message is returned to the queue
      // dlq 5 times
      throw error;
    }
  }
};
