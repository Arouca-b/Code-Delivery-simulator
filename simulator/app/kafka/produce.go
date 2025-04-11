package kafka

import (
	"encoding/json"
	"fmt"
	route2 "github.com/Arouca-b/Code-Delivery-simulator/app/routes"
	"github.com/Arouca-b/Code-Delivery-simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
	"time"
)

// Produce is responsible to publish the positions of each request
// Example of a json request:
// {"clientId":"1","routeId":"1"}
// {"clientId":"2","routeId":"2"}
// {"clientId":"3","routeId":"3"}
func Produce(msg *ckafka.Message) {
	fmt.Printf("Processando mensagem: %s\n", string(msg.Value))
	producer := kafka.NewKafkaProducer()
	route := route2.NewRoute()
	err := json.Unmarshal(msg.Value, &route)
	if err != nil {
		fmt.Printf("Erro ao deserializar mensagem: %s\n", err.Error())
		return
	}
	fmt.Printf("Rota carregada: ID=%s, ClientID=%s\n", route.ID, route.ClientID)
	err = route.LoadPositions()
	if err != nil {
		fmt.Printf("Erro ao carregar posições: %s\n", err.Error())
		return
	}
	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Println(err.Error())
	}
	for i, p := range positions {
		fmt.Printf("Enviando posição %d/%d para rota %s: %s\n", i+1, len(positions), route.ID, p)
		err := kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)
		if err != nil {
			log.Println(err.Error())
		}
		time.Sleep(time.Millisecond * 500)
	}
}
