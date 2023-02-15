re: down up build process

process: migrate
	@node -r dotenv/config lib/processor.js

build:
	@npm run build

build-processor-image:
	@docker build . --target processor -t squid-processor

build-query-node-image:
	@docker build . --target query-node -t query-node

build-images: build-processor-image build-query-node-image

serve:
	@npx squid-graphql-server --subscriptions

generate:
	@npx squid-typeorm-migration generate

migrate:
	@npx squid-typeorm-migration apply


codegen:
	@npx squid-typeorm-codegen


typegen:
	@npx squid-substrate-typegen typegen.json


up:
	@docker-compose up -d


down:
	@docker-compose down -v

archive:
	@docker-compose -f ./archive/docker-compose.yml up -d

archive-down:
	@docker-compose -f ./archive/docker-compose.yml down

.PHONY: build serve process migrate codegen typegen up down archive generate archive-down
