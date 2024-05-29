##### Autor: [Brenno Araújo de Oliveira](https://www.linkedin.com/in/brennoaraujo/)
##### Criado em: 28 de maio de 2024

# Desafio Yandeh - Serviço Pedidos

Este é um projeto desenvolvido como parte do processo seletivo da Yandeh. 

### npm install -g concurrently

### Testes

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "12345",
    "itens": [
      { "codigo": "A1", "quantidade": 2, "valorUnitario": 50 },
      { "codigo": "B1", "quantidade": 1, "valorUnitario": 100 }
    ]
  }'


curl -X GET http://localhost:3000/orders?clientId=12345 \
  -H "Content-Type: application/json"

  http://localhost:3000/orders?orderId=564933c5-e832-47e8-b0c7-fdacee4eaa95

curl -X PATCH http://localhost:3000/orders/{564933c5-e832-47e8-b0c7-fdacee4eaa95}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Faturado"
  }'



Para o DynamoDB Local: Abra seu navegador e acesse http://localhost:8000/shell
Para o ElasticMQ: Abra seu navegador e acesse http://localhost:9325
aws dynamodb list-tables --endpoint-url http://localhost:8000

curl -X POST http://localhost:9324/2012-11-05/OrderQueue -d "Action=CreateQueue&QueueName=OrderQueue"

### criar fila

