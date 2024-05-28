
import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Order } from '../models/order.model';

const options = process.env.IS_OFFLINE
  ? { region: 'us-west-2', endpoint: 'http://localhost:8000' }
  : {};

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.DYNAMODB_TABLE || '';

export class OrderRepository {
  async saveOrder(order: Order): Promise<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: TABLE_NAME,
      Item: order,
    };
    await dynamoDb.put(params).promise();
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const params: DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: { orderId },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item as Order | null;
  }

  async getOrdersByClientId(clientId: string): Promise<Order[]> {
    const params: DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'ClientIdIndex', // Assuming you have a secondary index on clientId
      KeyConditionExpression: 'clientId = :clientId',
      ExpressionAttributeValues: {
        ':clientId': clientId,
      },
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items as Order[];
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: TABLE_NAME,
      Key: { orderId },
      UpdateExpression: 'set orderStatus = :status',
      ExpressionAttributeValues: {
        ':status': status,
      },
    };
    await dynamoDb.update(params).promise();
  }
}
