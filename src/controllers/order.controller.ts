import { OrderService } from "../services/order.service";
import { OrderDTO, StatusDTO } from '../dtos/order.dto';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(data: any) {
    console.log('controller', data);
    const orderDTO = new OrderDTO(data);
    const validationResult = orderDTO.validate();
    if (!validationResult.isValid) {
      return { statusCode: 400, body: validationResult.errors };
    }
    
    try {
      // mandar para a fila
      await this.orderService.queueOrder(data);
      console.log('Order queued successfully');
      return { statusCode: 200, body: { message: 'Order queued successfully' } };
    } catch (error) {
      return { statusCode: 500, body: { error: 'Internal Server Error' } };
    }
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
