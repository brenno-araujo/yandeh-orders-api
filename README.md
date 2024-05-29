##### Autor: [Brenno Araújo de Oliveira](https://www.linkedin.com/in/brennoaraujo/)
##### Criado em: 28 de maio de 2024

# Desafio Yandeh - Serviço Pedidos

Este é um projeto desenvolvido como parte do processo seletivo da Yandeh. 

### Como executar o projeto

Para iniciar o projeto, você pode utilizar o Docker Compose. Certifique-se de ter o Docker instalado em sua máquina e, em seguida, execute o seguinte comando:

```bash
docker compose up
```

### Após a execução, você pode acessar a aplicação através do swagger:
```bash
http://localhost:8080
```

### Caso queira acessar a interface da fila SQS, utilize o seguinte endereço:
```bash
http://localhost:9325/
```

### Tecnologias utilizadas
- Node.js
- TypeScript
- Serverless
- AWS Lambda
- AWS API Gateway
- Filas SQS - Com conceito de Dead Letter Queue
- MySQL
- Docker
- Swagger

### Observações
- O projeto foi desenvolvido utilizando o conceito de Serverless, com a utilização de AWS Lambda e API Gateway.
- Para o cadastro de uma nova venda, é enviado um pedido para a fila SQS. Caso ocorra algum erro, há mais 4 tentativas de reenvio. Caso o erro persista, o pedido é enviado para a fila Dead Letter Queue.
- Comecei a implementação utlizando DynamoDB, mas devido a problemas de execução com o Docker, optei por utilizar o MySQL (simulando ser um banco não relacional).
- No diretório principal do projeto, há um arquivo chamado `csv-teste.csv` que contém dados para teste na rota que permite a importação de pedidos.
- Optei por não utlizar testes, pois utilizei o tempo para criar o ambiente de desenvolvimento e a implementação do projeto. Porém, acredito que a cobertura de testes é essencial para garantir a qualidade do código.
- Também optei por não utilizar arquitetura hexagonal, por ser um pouco mais demorado para implementar.

### Melhorias futuras
- Implementar testes unitários e de integração.
- Implementar arquitetura hexagonal.
- Implementar CI/CD.

### Agradecimentos
Agradeço a oportunidade de participar do processo seletivo da Yandeh. Foi um desafio muito interessante e que me fez pensar em diversas soluções para os problemas propostos.
