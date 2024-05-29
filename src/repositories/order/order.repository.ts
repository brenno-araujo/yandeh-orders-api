import { Order } from '../../entities/order.entity';

export class OrderRepository {
  private readonly order: typeof Order;
  
  constructor() {
    this.order = Order;
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const order = await this.order.findByPk(id, { raw: true });
      return order;
    } catch (error) {
      throw new Error('Erro ao buscar o produto');
    }
  }

  async create(data: any): Promise<Order> {
    try {
      return await this.order.create(data);
    } catch (error) {
      throw new Error('Erro ao criar o pedido');
    }
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    try {
      const order = await this.order.findByPk(id);
      if (order) {
        order.status = status;
        await order.save();
        return order;
      } else {
        throw new Error('Pedido não encontrado');
      }
    } catch (error) {
      throw new Error('Erro ao atualizar o status do pedido');
    }
  }

  async getOrdersByClientId(clientId: string): Promise<Order[]> {
    try {
      return await this.order.findAll({ where: { clientId } });
    } catch (error) {
      throw new Error('Erro ao buscar os pedidos');
    }
  }

}
