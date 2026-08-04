.PHONY: start-db stop-db start-front stop-front

# Este comando levanta todo lo que está en docker-compose.yml
start-db:
	docker compose up --build -d

# Este comando detiene todo
stop-db:
	docker compose down

# Este comando levanta el frontend
start-front:
	cd frontend && http-server --cors -p 8080

# Este comando detiene el frontend
stop-front:
	@fuser -k 8080/tcp || echo "No había nada corriendo en el puerto 8080"
	