import AWS from 'aws-sdk';

const optionsSqs = process.env.IS_DOCKER
  ? { region: 'us-east', endpoint: 'http://elasticmq:9324' }
  : { region: 'us-east', endpoint: 'http://localhost:9324' };

console.log('optionsSqs', optionsSqs);

const sqs = new AWS.SQS(optionsSqs);

export class SendMessageOrderQueueService {

  constructor() {}

  async execute(data: any): Promise<any> {
    try {
      console.log('service', data);
      const params = {
        QueueUrl: process.env.IS_DOCKER ? 'http://elasticmq:9324/queue/OrderQueue' : 'http://localhost:9324/queue/OrderQueue',
        MessageBody: JSON.stringify(data),
      };
      await sqs.sendMessage(params).promise();
      return { message: 'Order queued successfully' };
    } catch (error) {
      console.error('Failed to queue order:', error);
      throw new Error('Failed to queue order');
    } finally {
      console.log('finally');
    }
  }

}