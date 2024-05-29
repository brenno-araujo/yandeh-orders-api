import csv from 'csv-parser';
import { Readable } from 'stream';
import { OrderRepository } from '../repositories/order/order.repository';
import { DatabaseService } from '../database/database';
import DateHelper from '../helpers/data-helper';

class ImportService {
    private orderRepository: OrderRepository;
    private readonly databaseService: DatabaseService;
  
    constructor() {
      this.orderRepository = new OrderRepository();
      this.databaseService = new DatabaseService();
    }

    async execute(bodyBase64: string): Promise<any> {
        try {
            await this.databaseService.init();
            // Importar pedidos do arquivo CSV
            const orders = await this.importOrders(bodyBase64);
            // Adicione logs para depuração
            console.log('Orders:', orders);
            // Enviar pedidos para a fila
            let successArray = [] as any[];
            let failureArray = [] as any[];
            for (const order of orders) {
                // Adicione logs para depuração
                console.log('Order:', order);
                // Enviar pedido para a fila
                const result = await this.orderRepository.createUsingCsv(order);

                if (result.success) {
                    successArray.push(result.data);
                } 
                else {
                    failureArray.push(result.data);
                }
            }
            // Retornar a resposta
            return { success: successArray, failure: failureArray };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to import orders');
        } finally {
            await this.databaseService.close();
        }
    }
    
    private async importOrders(bodyBase64) {
        try {
        // Decodificar a string base64 para obter o corpo do arquivo CSV
        const body = Buffer.from(bodyBase64, 'base64').toString('utf-8');

        // Encontrar o índice de início do conteúdo do arquivo CSV
        const startIndex = body.indexOf('\r\n\r\n') + 4;
        // Extrair o conteúdo do arquivo CSV
        const csvContent = body.substring(startIndex, body.lastIndexOf('\r\n'));

        // Remover o caractere extra no início da string JSON
        const cleanedCsvContent = csvContent.replace(/^\uFEFF/, '');

        // Criar um stream de leitura a partir do conteúdo do arquivo CSV
        const stream = Readable.from(cleanedCsvContent);

        // Inicializar um array para armazenar os pedidos
        const orders = [] as any[];

        // Analisar o conteúdo do arquivo CSV
        await new Promise<void>((resolve, reject) => {
            stream
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                try {
                const items = JSON.parse(row.itens.replace(/""/g, '"'));
                const totalAmount = items.reduce((total: number, item: any) => total + item.valorUnitario * item.quantidade, 0);
                const deliveryDate = DateHelper.calculateDeliveryDate(new Date());
                console.log('Delivery Date:', deliveryDate);
                // Adicione logs para depuração
                console.log('Row:', row);
                // Processar cada linha do arquivo CSV e adicionar ao array de pedidos
                const order = {
                    clientId: row.idCliente.trim(), // Remove espaços em branco extras
                    items,
                    totalAmount,
                    deliveryDate,
                    status: 'Pendente',
                };
                orders.push(order);
                } catch (error) {
                console.error('Error parsing row:', row, error);
                }
            })
            .on('end', () => {
                console.log('CSV parsing ended');
                resolve();
            })
            .on('error', reject);
        });

        // Retornar o array de pedidos
        return orders;
        } catch (error) {
        console.error(error);
        throw new Error('Failed to import orders');
        }
    }

}

export default new ImportService();
