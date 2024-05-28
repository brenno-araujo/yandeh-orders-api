FROM amazon/dynamodb-local

# Copy the initialization script and table definition
COPY create-table.sh /create-table.sh
COPY dynamodb-init.json /dynamodb-init.json

# Default port for DynamoDB Local is 8000
EXPOSE 8000

# Make the script executable
RUN sudo chmod 755 /create-table.sh
