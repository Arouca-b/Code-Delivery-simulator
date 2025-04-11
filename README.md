# CODE DELIVERY SIMULATOR

## Sobre o Projeto

O Code Delivery Simulator é um sistema de simulação de entregas em tempo real que utiliza tecnologias modernas para rastrear e visualizar rotas de entrega em um mapa. O projeto é composto por quatro componentes principais que trabalham juntos para fornecer uma experiência completa de simulação de entregas.

## Arquitetura do Sistema

O sistema é composto pelos seguintes componentes:

1. **Apache Kafka**: Middleware de mensageria responsável pela comunicação entre os serviços
2. **Nest API (Backend)**: API REST e WebSocket desenvolvida com NestJS
3. **React Frontend**: Interface de usuário desenvolvida com React e Material UI
4. **Simulador Go**: Serviço em Go que simula o movimento dos entregadores

## Fluxo de Dados

O sistema funciona com o seguinte fluxo de dados:

1. O frontend envia uma mensagem WebSocket para o backend quando uma rota é iniciada
2. O backend publica uma mensagem no tópico Kafka `route.new-direction`
3. O simulador consome essa mensagem e começa a gerar posições
4. As posições são publicadas no tópico Kafka `route.new-position`
5. O backend consome essas posições e as envia para o frontend via WebSocket
6. O frontend atualiza a posição do veículo no mapa em tempo real

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

### 2. Inicialização do Sistema

O projeto utiliza um único arquivo docker-compose.yaml na raiz que gerencia todos os serviços. Para iniciar o sistema completo, execute:

```bash
docker-compose up -d
```

Este comando iniciará todos os serviços:

- **Apache Kafka**: Zookeeper, Kafka Broker, Kafka Connect, Elasticsearch, Kibana, Control Center
- **Nest API**: Servidor NestJS, MongoDB, Mongo Express
- **React Frontend**: Aplicação React (acessível em http://localhost:3001)
- **Simulador Go**: Serviço que gera as posições dos entregadores

Aguarde alguns minutos para que todos os serviços estejam prontos, especialmente o Kafka e seus componentes.

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

Para parar todos os serviços, execute na raiz do projeto:

```bash
docker-compose down
```

Para parar e remover todos os volumes (isso apagará os dados):

```bash
docker-compose down -v
```

## Detalhes Técnicos

### Apache Kafka

- Utiliza a porta 9092 para comunicação interna
- Utiliza a porta 9094 para comunicação externa
- Tópicos principais:
  - `route.new-direction`: Utilizado para iniciar uma nova rota
  - `route.new-position`: Utilizado para atualizar a posição do entregador

### Nest API

- Desenvolvida com NestJS
- Utiliza MongoDB para armazenar as rotas
- Implementa WebSockets para comunicação em tempo real com o frontend
- Consome e produz mensagens para o Kafka

### React Frontend

- Desenvolvido com React e Material UI
- Utiliza Google Maps API para exibir o mapa
- Conecta-se ao backend via WebSocket para receber atualizações em tempo real

### Simulador Go

- Desenvolvido em Go
- Consome mensagens do tópico `route.new-direction`
- Simula o movimento dos entregadores lendo coordenadas de arquivos de texto
- Publica as posições no tópico `route.new-position`

## Solução de Problemas

### Problema de Conexão com Kafka

Se o simulador não conseguir se conectar ao Kafka, verifique se a rede `default` foi criada corretamente:

```bash
docker network ls
```

Se necessário, recrie a rede e reinicie os serviços.

### Problema com WebSockets

Se as atualizações em tempo real não estiverem funcionando:

1. Verifique se o backend está recebendo as mensagens do Kafka
2. Verifique se o frontend está conectado ao WebSocket do backend
3. Verifique os logs do backend para possíveis erros

### Problema com o Simulador

Se o simulador não estiver atualizando as posições:

1. Verifique se o arquivo `.env` está configurado corretamente
2. Verifique se os tópicos do Kafka estão criados
3. Verifique os logs do simulador para possíveis erros

## Estrutura de Diretórios

```
Code-Delivery-simulator/
├── apache-kafka/         # Configuração do Apache Kafka
│   ├── connectors/       # Conectores do Kafka
│   ├── data/             # Dados persistentes do Kafka
│   └── es01/             # Dados do Elasticsearch
├── nest-api/             # Backend em NestJS
│   ├── src/              # Código-fonte do backend
│   │   ├── routes/       # Módulo de rotas
│   │   └── main.ts       # Ponto de entrada da aplicação
│   └── .docker/          # Configurações Docker
├── react-frontend/       # Frontend em React
│   ├── src/              # Código-fonte do frontend
│   │   ├── components/   # Componentes React
│   │   └── util/         # Utilitários
│   └── .docker/          # Configurações Docker
└── simulator/            # Simulador em Go
    ├── app/              # Código da aplicação
    ├── infra/            # Infraestrutura (Kafka)
    └── destinations/     # Arquivos de rotas
```

## Tecnologias Utilizadas

- **Backend**: NestJS, MongoDB, WebSockets, Kafka
- **Frontend**: React, Material UI, Google Maps API, Socket.io
- **Simulador**: Go, Kafka
- **Infraestrutura**: Docker, Kafka, Elasticsearch, Kibana
