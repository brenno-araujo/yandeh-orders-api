import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { OrderRepository } from '../repository/order.repository';
import { Order } from '../models/order.model';

const options = process.env.IS_OFFLINE
  ? { region: 'us-west-2', endpoint: 'http://localhost:9324' }
  : {};

const sqs = new AWS.SQS(options);

export class OrderService {
  private orderRepository: OrderRepository;
  private orderQueueUrl: string;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderQueueUrl = process.env.ORDER_QUEUE_URL || '';
  }

  private calculateDeliveryDate(orderDate: Date): Date {
    const day = orderDate.getDay();
    const hour = orderDate.getHours();

    if (day >= 1 && day <= 3) {
      orderDate.setDate(orderDate.getDate() + 3);
    } else if (day === 4 && hour <= 13) {
      orderDate.setDate(orderDate.getDate() + 4);
    } else {
      orderDate.setDate(orderDate.getDate() + 5);
    }

    return orderDate;
  }

  async queueOrder(data: any): Promise<any> {
    try {
      console.log('service', data);
      const params = {
        QueueUrl: this.orderQueueUrl,
        MessageBody: JSON.stringify(data),
      };
      await sqs.sendMessage(params).promise();
      return { message: 'Order queued successfully' };
    } catch (error) {
      console.error('Failed to queue order:', error);
      throw new Error('Failed to queue order');
    }
  }

  async createOrder(data: any): Promise<any> {
    console.log('service', data);
    const orderId = uuidv4();
    const orderDate = new Date();
    const deliveryDate = this.calculateDeliveryDate(orderDate);

    const order = new Order(
      orderId,
      data.idCliente,
      data.itens,
      data.itens.reduce((total: number, item: { valorUnitario: number, quantidade: number }) => total + item.valorUnitario * item.quantidade, 0),
      deliveryDate.toISOString(),
      'Pendente'
    );

    await this.orderRepository.saveOrder(order);
    return {
      numeroPedido: order.orderId,
      valorTotal: order.totalAmount,
      dataEntrega: order.deliveryDate,
    };
  }

  async importOrders(orders: any[]): Promise<any[]> {
    const results: { error: any }[] = [];

    for (const data of orders) {
      try {
        const result = await this.createOrder(data);
        results.push(result);
      } catch (error: any) {
        results.push({ error: error.message });
      }
    }

    return results;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const validStatuses = ['Pendente', 'Faturado', 'Cancelado', 'Entregue'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    await this.orderRepository.updateOrderStatus(orderId, status);
  }

  async getOrder(queryParams: any): Promise<Order | Order[]> {
    if (queryParams.orderId) {
      const order = await this.orderRepository.getOrderById(queryParams.orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    }

    if (queryParams.clientId) {
      const orders = await this.orderRepository.getOrdersByClientId(queryParams.clientId);
      if (!orders.length) {
        throw new Error('No orders found for this client');
      }
      return orders;
    }

    throw new Error('Invalid query parameters');
  }
}
