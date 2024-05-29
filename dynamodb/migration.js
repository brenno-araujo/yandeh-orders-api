const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();
console.log('dna ' +process.env.DYNAMODB_ENDPOINT);
console.log('sqs '+process.env.SQS_ENDPOINT);

AWS.config.update({
  credentials: new AWS.Credentials('fakeAccessKeyId', 'fakeSecretAccessKey'),
  region: 'sa-east-1',
  // endpoint: process.env.DYNAMODB_ENDPOINT
  endpoint: 'http://localhost:8000'
});

// Instância do DynamoDB
const dynamoDB = new AWS.DynamoDB();

// Definição dos parâmetros para criar a tabela
const params = {
  TableName: 'Ordersssss',
  AttributeDefinitions: [
    { AttributeName: 'orderId', AttributeType: 'S' }, // String
    { AttributeName: 'clientId', AttributeType: 'S' }  // String
  ],
  KeySchema: [
    { AttributeName: 'orderId', KeyType: 'HASH' },     // Partition key
    { AttributeName: 'clientId', KeyType: 'RANGE' }    // Sort key
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  }
};

// Cria a tabela no DynamoDB
dynamoDB.createTable(params, (err, data) => {
  if (err) {
    console.error("Erro ao criar a tabela:", err);
  } else {
    console.log("Tabela criada com sucesso:", data);
  }
});
