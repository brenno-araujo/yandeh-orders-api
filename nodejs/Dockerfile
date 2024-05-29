# Use a base Node.js image
FROM node:18.17.0

# Install Serverless Framework and necessary plugins
RUN npm install -g serverless@3.0.0 serverless-offline serverless-plugin-typescript

# Adicione essa linha para instalar o netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Define the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script
COPY nodejs/entrypoint.sh /usr/src/app/nodejs/entrypoint.sh
RUN chmod +x /usr/src/app/nodejs/entrypoint.sh

# Default command to run when the container starts
ENTRYPOINT ["/usr/src/app/nodejs/entrypoint.sh"]