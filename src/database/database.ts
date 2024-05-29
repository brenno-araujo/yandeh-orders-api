import { Sequelize } from 'sequelize-typescript';
import { Order } from '../entities/order.entity';

export class DatabaseService {
  private sequelize: Sequelize | null = null;

  constructor() {}

  async init() {
    if (this.sequelize === null) {
      try {
        console.log('Iniciando conexão com o banco de dados...');
        console.log('DB_DATABASE:', process.env.DB_NAME);
        console.log('DB_USERNAME:', process.env.DB_USER);
        console.log('DB_PASSWORD:', process.env.DB_PASS);
        console.log('DB_HOST:', process.env.DB_HOST);
        console.log('DB_PORT:', process.env.DB_PORT);

        this.sequelize = new Sequelize({
          database: process.env.DB_DATABASE || 'orders_tb',
          dialect: 'mysql',
          username: process.env.DB_USERNAME || 'brenno_araujo_user',
          password: process.env.DB_PASSWORD || 'brenno_araujo_password',
          host: process.env.DB_HOST || '127.0.0.1',
          port: Number(process.env.DB_PORT) || 3307,
        });
        this.sequelize.addModels([
          Order,
        ]);
        await this.sequelize.sync();
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } else {
      console.log('A conexão com o banco de dados já está iniciada.');
    }
  }

  async close() {
    if (this.sequelize !== null) {
      await this.sequelize.close();
      console.log('Conexão com o banco de dados encerrada.');
      this.sequelize = null;
    } else {
      console.log('A conexão com o banco de dados já está encerrada.');
    }
  }

  async getTransaction() {
    if (this.sequelize !== null) {
      return await this.sequelize.transaction();
    } else {
      throw new Error('A conexão com o banco de dados não foi iniciada.');
    }
  }
}
