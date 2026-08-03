.PHONY: start-db run stop-db

start-db:
	docker compose up -d

stop-db:
	docker compose down

start-backend:
	cd ./backend && npm run dev

run: start-db start-backend