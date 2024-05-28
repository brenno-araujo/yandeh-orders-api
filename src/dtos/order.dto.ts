export class OrderDTO {
    private data: any;
  
    constructor(data: any) {
      this.data = data;
    }
  
    validate(): { isValid: boolean, errors: string[] } {
      console.log('dto', this.data);
      const errors: string[] = [];
      if (!this.data.idCliente) {
        errors.push('idCliente is required');
      }
      if (!this.data.itens || !Array.isArray(this.data.itens) || this.data.itens.length === 0) {
        errors.push('itens are required and should be a non-empty array');
      } else {
        this.data.itens.forEach((item: any, index: number) => {
          if (!item.codigo) {
            errors.push(`codigo is required for item at index ${index}`);
          }
          if (!item.quantidade || item.quantidade <= 0) {
            errors.push(`quantidade should be greater than 0 for item at index ${index}`);
          }
          if (!item.valorUnitario || item.valorUnitario <= 0) {
            errors.push(`valorUnitario should be greater than 0 for item at index ${index}`);
          }
        });
      }
      return { isValid: errors.length === 0, errors };
    }
  }
  
  export class StatusDTO {
    private data: any;
  
    constructor(data: any) {
      this.data = data;
    }
  
    validate(): { isValid: boolean, errors: string[] } {
      const validStatuses = ['Pendente', 'Faturado', 'Cancelado', 'Entregue'];
      if (!this.data.status || !validStatuses.includes(this.data.status)) {
        return { isValid: false, errors: ['Invalid status'] };
      }
      return { isValid: true, errors: [] };
    }
  }
  