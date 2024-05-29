import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { OrderRepository } from '../repositories/order/order.repository';
import { DatabaseService } from '../database/database';

interface Order {
  orderId: string;
  clientId: string;
  items: {};
  totalAmount: number;
  deliveryDate: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const optionsSqs = process.env.IS_DOCKER
  ? { region: 'us-east', endpoint: 'http://elasticmq:9324' }
  : { region: 'us-east', endpoint: 'http://localhost:9324' };

console.log('optionsSqs', optionsSqs);

const sqs = new AWS.SQS(optionsSqs);

export class OrderService {
  private orderRepository: OrderRepository;
  private readonly databaseService: DatabaseService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.databaseService = new DatabaseService();
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

  async createOrder(data: any): Promise<any> {
    try {
      console.log('service', data);
      await this.databaseService.init();

      const orderDate = new Date();
      const deliveryDate = this.calculateDeliveryDate(orderDate);

      const order = {
        clientId: data.idCliente,
        items: data.itens,
        totalAmount: data.itens.reduce((total: number, item: any) => total + item.valorUnitario * item.quantidade, 0),
        deliveryDate,
        status: 'Pendente',
      };

      const created = await this.orderRepository.create(order);
      return {
        numeroPedido: created.orderId,
        valorTotal: order.totalAmount,
        dataEntrega: order.deliveryDate,
      };
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Failed to create order');
    } finally {
      await this.databaseService.close();
    }
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
    try {
      this.databaseService.init();
      const validStatuses = ['Pendente', 'Faturado', 'Cancelado', 'Entregue'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }
    await this.orderRepository.updateStatus(orderId, status);
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw new Error('Failed to update order status');
    } finally {
      this.databaseService.close();
    }

  }

  async getOrder(queryParams: any): Promise<Order | Order[]> {
    try {
      this.databaseService.init();
      if (queryParams.orderId) {
        const order = await this.orderRepository.findById(queryParams.orderId);
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
    } catch (error) {
      console.error('Failed to get order:', error);
      throw new Error('Failed to get order');
    } finally {
      this.databaseService.close();
    }
    throw new Error('Invalid query parameters');
  }
}
