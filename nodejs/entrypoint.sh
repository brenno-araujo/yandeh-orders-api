#!/bin/bash

# Função para aguardar o MySQL
# wait_for_dynamo() {
#   echo "Aguardando o dynamodb..."
#   while ! nc -z dynamodb 8000; do
#     sleep 0.1
#   done
# }

# # Aguarda o MySQL ficar pronto
# wait_for_dynamo

# Executa as migrações do DynamoDB
# echo "Executando as migrações do DynamoDB..."
# node dynamodb/migration.js

# Inicia o Serverless Offline
echo "Iniciando o Serverless Offline..."
serverless offline