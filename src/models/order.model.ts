export class Order {
    orderId: string;
    clientId: string;
    items: { codigo: string, quantidade: number, valorUnitario: number }[];
    totalAmount: number;
    deliveryDate: string;
    status: string;
  
    constructor(orderId: string, clientId: string, items: { codigo: string, quantidade: number, valorUnitario: number }[], totalAmount: number, deliveryDate: string, status: string) {
      this.orderId = orderId;
      this.clientId = clientId;
      this.items = items;
      this.totalAmount = totalAmount;
      this.deliveryDate = deliveryDate;
      this.status = status;
    }
  }
  