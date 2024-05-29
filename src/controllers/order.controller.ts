import { OrderService } from "../services/order.service";
import { StatusDTO } from '../dtos/order.dto';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async importOrders(event: any) {
    return { statusCode: 200, body: { message: 'Import Orders' } };
  }

  async updateOrderStatus(orderId: string, data: any) {
    const statusDTO = new StatusDTO(data);
    const validationResult = statusDTO.validate();
    if (!validationResult.isValid) {
      return { statusCode: 400, body: validationResult.errors };
    }
    
    try {
      const result = await this.orderService.updateOrderStatus(orderId, data.status);
      return { statusCode: 200, body: result };
    } catch (error) {
      return { statusCode: 500, body: { error: 'Internal Server Error' } };
    }
  }

  async getOrder(queryParams: any) {
    try {
      return await this.orderService.getOrder(queryParams);
    } catch (error) {
      throw error;
    }
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
