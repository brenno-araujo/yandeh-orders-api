import { UpdateStatusService } from '../services/update-status.service';
import { StatusDTO } from '../dtos/order.dto';

export class UpdateStatusController {
  private service: UpdateStatusService;

  constructor() {
    this.service = new UpdateStatusService();
  }

  async execute(orderId: string, data: any) {
    const statusDTO = new StatusDTO(data);
    const validationResult = statusDTO.validate();
    if (!validationResult.isValid) {
      return { statusCode: 400, body: validationResult.errors };
    }
    
    try {
      const result = await this.service.execute(orderId, data.status);
      return { statusCode: 200, body: result };
    } catch (error) {
      return { statusCode: 500, body: { error: 'Internal Server Error' } };
    }
  }
}