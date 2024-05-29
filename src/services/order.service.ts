import AWS from 'aws-sdk';
import { OrderRepository } from '../repositories/order/order.repository';
import { DatabaseService } from '../database/database';
import DateHelper from '../helpers/data-helper';

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

  async createOrder(data: any): Promise<any> {
    try {
      console.log('service', data);
      await this.databaseService.init();

      const orderDate = new Date();
      const deliveryDate = DateHelper.calculateDeliveryDate(orderDate);

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

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      this.databaseService.init();
      const validStatuses = ['Pendente', 'Faturado', 'Cancelado', 'Entregue'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }
      const order = await this.orderRepository.updateStatus(orderId, status);
      return order;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw new Error('Failed to update order status');
    } finally {
      this.databaseService.close();
    }

  }

  async getOrder(queryParams: any): Promise<Order | Order[]> {
    try {
      await this.databaseService.init();
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
      await this.databaseService.close();
    }
    throw new Error('Invalid query parameters');
  }
}
