COMPOSE_FILE=docker-compose.yml

build:
	docker-compose -f $(COMPOSE_FILE) build

start:
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	docker-compose -f $(COMPOSE_FILE) down

restart: stop start

clean:
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans

