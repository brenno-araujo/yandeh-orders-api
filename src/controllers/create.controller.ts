import { SendMessageOrderQueueService } from '../services/send-message-order-queue.service';
import { OrderDTO } from '../dtos/order.dto';

export class CreateController {
  private service: SendMessageOrderQueueService;

  constructor() {
    this.service = new SendMessageOrderQueueService();
  }

  async execute(data: any) {
    console.log('controller', data);
    const orderDTO = new OrderDTO(data);
    const validationResult = orderDTO.validate();
    if (!validationResult.isValid) {
      return { statusCode: 400, body: validationResult.errors };
    }
    
    try {
      // mandar para a fila
      await this.service.execute(data);
      console.log('Order queued successfully');
      return { statusCode: 200, body: { message: 'Order queued successfully' } };
    } catch (error) {
      return { statusCode: 500, body: { error: 'Internal Server Error' } };
    }
  }
}