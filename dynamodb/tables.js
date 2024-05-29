const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");

// Configuração do DynamoDB local
const client = new DynamoDBClient({
  region: 'sa-east-1',
  endpoint: 'http://localhost:8000',
});

// Parâmetros para listar as tabelas


// Função para listar as tabelas no DynamoDB
async function listTables() {
  try {
    // const command = new ListTablesCommand(params);
    // const data = await client.send(command);
    // busca pela tabela Orders
    const params = {
      TableName: 'Orders',
    };
    const data = await client.send(new ListTablesCommand(params));

    console.log("Tabelas existentes:", data);
  } catch (err) {
    console.error("Erro ao listar tabelas:", err);
  }
}

listTables();
