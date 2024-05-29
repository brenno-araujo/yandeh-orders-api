import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';

@Table({ tableName: 'orders' })
export class Order extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ field: 'orderId', type: DataType.UUID })
  declare orderId: string;

  @Column({ field: 'clientId', type: DataType.STRING })
  declare clientId: string;

  @Column({ field: 'items', type: DataType.JSONB })
  declare items: { codigo: string, quantidade: number, valorUnitario: number }[];

  @Column({ field: 'totalAmount', type: DataType.DECIMAL(10, 2) })
  declare totalAmount: number;

  @Column({ field: 'deliveryDate', type: DataType.DATE })
  declare deliveryDate: Date;

  @Column({ field: 'status', type: DataType.STRING })
  declare status: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at', type: DataType.DATE })
  declare deletedAt: Date;
}
