SHELL:=/bin/bash
DOCKER_IMAGE?=opentutor-web-client
DOCKER_CONTAINER=opentutor-web-client
OPENTUTOR_CLIENT_VERSION?=latest
DIR=$(shell pwd)
PROJECT_ROOT?=$(shell git rev-parse --show-toplevel 2> /dev/null)
PROJECT_NAME=$(shell v='$(PROJECT_ROOT)'; echo "$${v\#\#*/}")
CLIENT=$(PROJECT_ROOT)/client
BUILD=$(DIR)/build


.PHONY clean:
clean:
	rm -rf build node_modules

build/client:
	mkdir -p build
	rsync -rv --exclude=node_modules $(CLIENT) build

build: build/client

.PHONY docker-build:
docker-build:
	docker build \
		-t $(DOCKER_IMAGE) \
		--build-arg "OPENTUTOR_CLIENT_VERSION=$(OPENTUTOR_CLIENT_VERSION)" \
	.

.PHONY docker-run:
docker-run:
	docker run \
			-it \
			--rm \
			--name $(DOCKER_CONTAINER) \
			-e DIALOG_ENDPOINT="https://dev-opentutor.pal3.org/dialog" \
			-p 3000:3000 \
		$(DOCKER_IMAGE) 


.PHONY docker-run-shell:
docker-run-shell:
	docker run \
			-it \
			--rm \
			--name $(DOCKER_CONTAINER) \
			-p 3000:3000 \
			--entrypoint /bin/bash \
		$(DOCKER_IMAGE) 
		

.PHONY exec-shell:
exec-shell:
	docker exec \
			-it \
		$(DOCKER_CONTAINER) \
			bash

.PHONY: format
format:
	npm run format

node_modules/eslint:
	npm install

node_modules/license-check-and-add:
	npm ci

node_modules/prettier:
	npm install

node_modules/typescript:
	npm install

.PHONY: test-all
test-all:
	#$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-license
	$(MAKE) test-lint
	# $(MAKE) test-types

.PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format:
	npm run test:format

.PHONY: test-license
test-license: node_modules/license-check-and-add
	npm run test:license

.PHONY: test-lint
test-lint:
	npm run test:lint

.PHONY: test-types
test-types: node_modules/typescript
	npm run test:types
