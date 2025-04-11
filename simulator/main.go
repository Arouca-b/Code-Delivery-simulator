package main

import (
	"fmt"
	kafka2 "github.com/Arouca-b/Code-Delivery-simulator/app/kafka"
	"github.com/Arouca-b/Code-Delivery-simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	fmt.Println("Iniciando simulador...")
	fmt.Println("Configurações Kafka:")
	fmt.Println("Bootstrap Servers:", os.Getenv("KafkaBootstrapServers"))
	fmt.Println("Consumer Group ID:", os.Getenv("KafkaConsumerGroupId"))
	fmt.Println("Read Topic:", os.Getenv("KafkaReadTopic"))
	fmt.Println("Produce Topic:", os.Getenv("KafkaProduceTopic"))

	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()
	fmt.Println("Aguardando mensagens...")
	for msg := range msgChan {
		fmt.Println("Mensagem recebida do tópico", *msg.TopicPartition.Topic, ":", string(msg.Value))
		go kafka2.Produce(msg)
	}
}
