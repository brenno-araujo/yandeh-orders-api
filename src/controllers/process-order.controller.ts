import { ProcessOrderService } from '../services/process-order.service';

export class ProcessOrderController {
  private service: ProcessOrderService;

  constructor() {
    this.service = new ProcessOrderService();
  }

  async execute(data: any) {
    console.log('controller - processa fila', data);
    try {
      await this.service.execute(data);
    } catch (error) {
      console.error('Failed to process order:', error);
      throw error;
    }
  }
}