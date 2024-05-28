#!/bin/bash
echo "Creating table in DynamoDB Local..."
# Wait for DynamoDB Local to start
sleep 10

# Create the table
aws dynamodb create-table \
    --cli-input-json file:///dynamodb-init.json \
    --endpoint-url http://localhost:8000