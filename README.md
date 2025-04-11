# CODE DELIVERY SIMULATOR

## Sobre o Projeto

O Code Delivery Simulator é um sistema de simulação de entregas em tempo real que utiliza tecnologias modernas para rastrear e visualizar rotas de entrega em um mapa. O projeto é composto por quatro componentes principais que trabalham juntos para fornecer uma experiência completa de simulação de entregas.

## Arquitetura do Sistema

O sistema é composto pelos seguintes componentes:

1. **Apache Kafka**: Middleware de mensageria responsável pela comunicação entre os serviços
2. **Nest API (Backend)**: API REST e WebSocket desenvolvida com NestJS
3. **React Frontend**: Interface de usuário desenvolvida com React e Material UI
4. **Simulador Go**: Serviço em Go que simula o movimento dos entregadores

## Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto completo:

### 1. Clone o repositório

```bash
git clone https://github.com/Arouca-b/Code-Delivery-simulator.git
cd Code-Delivery-simulator
```

### 2. Ordem de Inicialização dos Serviços

É importante iniciar os serviços na seguinte ordem para garantir o funcionamento correto do sistema:

#### 2.1. Apache Kafka (Primeiro)

```bash
cd apache-kafka
docker-compose up -d
```

Este comando iniciará:

- Zookeeper
- Kafka Broker
- Kafka Connect
- Elasticsearch
- Kibana
- Control Center

Aguarde alguns minutos para que todos os serviços do Kafka estejam prontos.

#### 2.2. Nest API (Segundo)

```bash
cd ../nest-api
docker-compose up -d
```

Este comando iniciará:

- Servidor NestJS
- MongoDB
- Mongo Express

#### 2.3. React Frontend (Terceiro)

```bash
cd ../react-frontend
docker-compose up -d
```

Este comando iniciará a aplicação React que será acessível em http://localhost:3001

#### 2.4. Simulador Go (Quarto)

```bash
cd ../simulator
docker-compose up -d
```

Este comando iniciará o simulador que irá gerar as posições dos entregadores.

## Como Utilizar o Sistema

### 1. Acessando as Interfaces

- **Frontend React**: http://localhost:3001
- **Mongo Express**: http://localhost:8081
- **Kafka Control Center**: http://localhost:9021
- **Kibana**: http://localhost:5601

### 2. Simulando uma Entrega

1. Acesse o frontend React em http://localhost:3001
2. Selecione uma rota na lista suspensa
3. Clique no botão "Iniciar uma corrida"
4. Observe o veículo se movendo no mapa em tempo real

### 3. Fluxo de Dados

Quando uma rota é iniciada:

1. O frontend envia uma mensagem WebSocket para o backend
2. O backend publica uma mensagem no tópico Kafka `route.new-direction`
3. O simulador consome essa mensagem e começa a gerar posições
4. As posições são publicadas no tópico Kafka `route.new-position`
5. O backend consome essas posições e as envia para o frontend via WebSocket
6. O frontend atualiza a posição do veículo no mapa

## Monitoramento e Depuração

### Kafka Control Center

Acesse http://localhost:9021 para monitorar:

- Tópicos do Kafka
- Produtores e consumidores
- Mensagens sendo trocadas

### Mongo Express

Acesse http://localhost:8081 para:

- Visualizar e gerenciar os dados do MongoDB
- Verificar as rotas cadastradas

### Logs dos Containers

Para verificar os logs de um serviço específico:

```bash
docker logs [nome-do-container] -f
```

Exemplo:

```bash
docker logs simulator -f
```

## Parando os Serviços

Para parar todos os serviços, execute em cada diretório:

```bash
docker-compose down
```

Para parar e remover todos os volumes (isso apagará os dados):

```bash
docker-compose down -v
```

## Solução de Problemas

### Problema de Conexão com Kafka

Se o simulador não conseguir se conectar ao Kafka, verifique se a rede `apache-kafka_default` foi criada corretamente:

```bash
docker network ls
```

Se necessário, recrie a rede e reinicie os serviços.

### Problema com WebSockets

Se as atualizações em tempo real não estiverem funcionando:

1. Verifique se o backend está recebendo as mensagens do Kafka
2. Verifique se o frontend está conectado ao WebSocket do backend
3. Verifique os logs do backend para possíveis erros

## Tecnologias Utilizadas

- **Backend**: NestJS, MongoDB, WebSockets, Kafka
- **Frontend**: React, Material UI, Google Maps API, Socket.io
- **Simulador**: Go, Kafka
- **Infraestrutura**: Docker, Kafka, Elasticsearch, Kibana
