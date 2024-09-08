.DEFAULT_GOAL := help
.PHONY: help

INTERACTIVE := $(shell [ -t 0 ] && echo i || echo d)
APPDIR = /app
PWD=$(shell pwd)
PORT=3000
DEBUG_PORT=9229
CONTAINER_NAME=open-org-chart

welcome:
	@echo "Welcome to ${CONTAINER_NAME}"

setup: welcome build-docker-image ## Install dependencies
ifeq ("$(wildcard ./.env)","")
	@cp .env.default .env
endif

check-if-docker-image-exists: ## Used to check if docker image exists
ifeq ($(shell docker images -q ${CONTAINER_NAME} 2> /dev/null | wc -l | bc),0)
	@echo "Docker image not found, building Docker image first"; sleep 2;
	@make build-docker-image
endif

build-docker-image: ## Build docker image (no cache)
	@echo "Building docker image from Dockerfile"
	@docker build --force-rm . --target production -t ${CONTAINER_NAME}:latest

start: welcome check-if-docker-image-exists ## Start project
	@echo 'Running on http://0.0.0.0:$(PORT)'
	@docker run -t${INTERACTIVE} --rm --env-file=.env -p ${PORT}:${PORT} --name ${CONTAINER_NAME}-production ${CONTAINER_NAME}:latest

help: welcome
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep ^help -v | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
