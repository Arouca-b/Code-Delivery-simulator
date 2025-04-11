# Simulador de Entregas com Apache Kafka

Este projeto é um simulador de entregas que utiliza Apache Kafka para processamento de eventos em tempo real, com integração com Elasticsearch para armazenamento e Kibana para visualização.

## Pré-requisitos

- Docker
- Docker Compose
- Git

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone github.com/Arouca-b/Code-Delivery-simulator
cd Code-Delivery-simulator
```

### 2. Iniciando os serviços com Docker

Navegue até o diretório do Apache Kafka:

```bash
cd apache-kafka
```

Execute o Docker Compose para iniciar todos os serviços:

```bash
docker-compose up -d
```

Este comando iniciará os seguintes serviços:

- Apache Kafka
- Zookeeper
- Kafka Connect
- Elasticsearch
- Kibana
- Control Center (Confluent)

### 3. Verificando os serviços

Após a inicialização, você pode acessar:

- Kafka Control Center: http://localhost:9021
- Kibana: http://localhost:5601
- Elasticsearch: http://localhost:9200

### 4. Configurando o Kafka Connect

O conector Elasticsearch já está configurado automaticamente através do arquivo de propriedades. Para verificar se está funcionando corretamente, acesse:

```bash
curl http://localhost:8083/connectors
```

### 5. Tópicos do Kafka

O sistema utiliza dois tópicos principais:

- `route.new-direction`: Para novas rotas
- `route.new-position`: Para atualizações de posição

Estes tópicos são criados automaticamente durante a inicialização através do serviço `kafka-topics-generator`.

### 6. Monitoramento

- Use o Control Center (http://localhost:9021) para monitorar os tópicos do Kafka
- Use o Kibana (http://localhost:5601) para visualizar os dados armazenados no Elasticsearch

### 7. Parando os serviços

Para parar todos os serviços:

```bash
docker-compose down
```

Para parar e remover todos os volumes (isso apagará todos os dados):

```bash
docker-compose down -v
```

## Estrutura do Projeto

- `apache-kafka/`: Diretório principal com as configurações do Kafka
  - `docker-compose.yaml`: Configurações dos containers Docker
  - `connectors/`: Diretório com as configurações dos conectores
    - `elasticsearch.properties`: Configuração do conector Elasticsearch

## Troubleshooting

1. Se os serviços não iniciarem corretamente:

   - Verifique se as portas necessárias estão disponíveis (9092, 9094, 9021, 9200, 5601)
   - Verifique os logs usando `docker-compose logs [nome-do-serviço]`

2. Se o Elasticsearch não iniciar:

   - Verifique se você tem permissões suficientes no diretório `es01`
   - Aumente a memória virtual do sistema se necessário

3. Se o Kafka Connect não funcionar:
   - Verifique se o Elasticsearch está acessível
   - Confirme se as configurações no arquivo `elasticsearch.properties` estão corretas
