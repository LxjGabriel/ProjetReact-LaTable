COMPOSE_FILE=docker-compose.yml

start:
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	docker-compose -f $(COMPOSE_FILE) down

restart: stop start

clean:
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans

