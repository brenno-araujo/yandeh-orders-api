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

export class FindService {
  private orderRepository: OrderRepository;
  private readonly databaseService: DatabaseService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.databaseService = new DatabaseService();
  }

  async execute(queryParams: any): Promise<Order | Order[]> {
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
