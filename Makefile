COMPOSE_FILE=docker-compose.yml

up:
	docker-compose -f $(COMPOSE_FILE) up -d $(SERVICES)

down:
	docker-compose -f $(COMPOSE_FILE) down

build:
	docker-compose -f $(COMPOSE_FILE) build $(SERVICES)

logs:
	docker-compose -f $(COMPOSE_FILE) logs -f $(SERVICES)

clean:
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans

