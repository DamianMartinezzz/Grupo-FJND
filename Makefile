.PHONY: start-db stop-db

# Este comando levanta todo lo que está en docker-compose.yml

start-db:
	docker compose up --build -d

# Este comando detiene todo
stop-db:
	docker compose down
	