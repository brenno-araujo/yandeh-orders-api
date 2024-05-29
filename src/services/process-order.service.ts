import { OrderRepository } from '../repositories/order/order.repository';
import { DatabaseService } from '../database/database';
import DateHelper from '../helpers/data-helper';

export class ProcessOrderService {
  private orderRepository: OrderRepository;
  private readonly databaseService: DatabaseService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.databaseService = new DatabaseService();
  }

  async execute(data: any): Promise<any> {
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
}
