# Simulador de Entrega

## Pré-requisitos

- Docker e Docker Compose instalados
- Git (para clonar o repositório)
- Uma rede Kafka existente chamada `apache-kafka_default` (o simulador precisa se conectar ao Kafka)

## Configuração e Instalação

1. Clone o repositório:

```bash
git clone github.com/Arouca-b/Code-Delivery-simulator
cd Code-Delivery-simulator/simulator
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

As variáveis de ambiente padrão são:

- `KafkaBootstrapServers=kafka:9092` - Endereço do servidor Kafka
- `KafkaConsumerGroupId=simulator` - ID do grupo consumidor
- `KafkaReadTopic=route.new-direction` - Tópico para leitura de novas direções
- `KafkaProduceTopic=route.new-position` - Tópico para produção de novas posições

## Executando com Docker

1. Construa e inicie o simulador:

```bash
docker-compose up -d
```

Este comando irá:

- Construir a aplicação Go usando o Dockerfile
- Instalar todas as dependências necessárias, incluindo `librdkafka-dev`
- Montar o diretório atual em `/go/src/` no container
- Conectar à rede do Kafka
- Executar o simulador em segundo plano

2. Verificar logs:

```bash
docker logs simulator
```

Você deverá ver uma saída similar a:

```
Iniciando simulador...
Configurações Kafka:
Bootstrap Servers: kafka:9092
Consumer Group ID: simulator
Read Topic: route.new-direction
Produce Topic: route.new-position
Aguardando mensagens...
```

## Desenvolvimento

Se precisar modificar o código e reconstruir:

```bash
docker-compose down
docker-compose up -d --build
```

## Dependências

As principais dependências são gerenciadas através dos módulos Go:

- `github.com/confluentinc/confluent-kafka-go` - Cliente Kafka
- `github.com/joho/godotenv` - Configuração de ambiente

O Docker irá gerenciar a instalação de todas as dependências automaticamente durante a construção do container.

## Arquitetura

O simulador:

1. Conecta-se ao Kafka como consumidor
2. Escuta mensagens no tópico `route.new-direction`
3. Quando uma mensagem é recebida, processa e produz novos dados de posição
4. Envia os dados de posição para o tópico `route.new-position`

## Observações Importantes

- Certifique-se de que o serviço Kafka esteja em execução e acessível através da rede `apache-kafka_default`
- O simulador deve conseguir se conectar ao Kafka no endereço `kafka:9092`
- Todos os logs estão disponíveis através dos logs do Docker
