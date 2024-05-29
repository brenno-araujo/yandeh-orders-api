import { FindService } from "../services/find.service";

export class FindController {
  private service: FindService;

  constructor() {
    this.service = new FindService();
  }

  async execute(queryParams: any) {
    try {
      return await this.service.execute(queryParams);
    } catch (error) {
      throw error;
    }
  }
}