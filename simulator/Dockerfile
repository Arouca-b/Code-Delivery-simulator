FROM golang:1.21

WORKDIR /go/src
ENV PATH="/go/bin:${PATH}"

RUN apt-get update && apt-get install build-essential librdkafka-dev -y

COPY . .
RUN go mod tidy
CMD ["go", "run", "main.go"]