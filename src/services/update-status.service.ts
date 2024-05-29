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

export class UpdateStatusService {
  private orderRepository: OrderRepository;
  private readonly databaseService: DatabaseService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.databaseService = new DatabaseService();
  }

  async execute(orderId: string, status: string): Promise<Order> {
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
}
