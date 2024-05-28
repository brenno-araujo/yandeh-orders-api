const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

// Função assíncrona para enviar mensagem para a fila SQS
async function sendMessageToQueue() {
  // Configurar o endpoint para a fila SQS local
  const sqsClient = new SQSClient({
    region: "us-west-2", // Região fictícia apenas para inicialização
    endpoint: "http://localhost:9324",
  });

  // URL da fila SQS local
  const queueUrl = "http://localhost:9324/queue/OrderQueue";

  // Corpo da mensagem de teste
  const messageBody = "Mensagem de teste";

  // Parâmetros para enviar a mensagem
  const params = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };

  // Enviar a mensagem para a fila SQS
  try {
    const command = new SendMessageCommand(params);
    const data = await sqsClient.send(command);
    console.log("Mensagem enviada com sucesso:", data);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

// Chamar a função assíncrona para enviar a mensagem
sendMessageToQueue();
