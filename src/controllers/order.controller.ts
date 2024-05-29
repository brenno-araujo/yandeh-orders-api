import { OrderService } from "../services/order.service";
import { StatusDTO } from '../dtos/order.dto';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }


  async processOrder(data: any) {
    console.log('controller - processa fila', data);
    try {
      await this.orderService.createOrder(data);
    } catch (error) {
      console.error('Failed to process order:', error);
      throw error;
    }
  }
}
