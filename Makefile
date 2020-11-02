PHONY: clean
clean:
	cd client && $(MAKE) clean
	cd docker && $(MAKE) clean

PHONY: develop
develop:
	cd client && $(MAKE) develop

PHONY: format
format:
	cd client && $(MAKE) format

PHONY: test
test:
	cd client && $(MAKE) test

PHONY: test-all
test-all:
	$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-license
	$(MAKE) test-types
	# $(MAKE) test

PHONY: test-audit
test-audit:
	cd client && $(MAKE) test-audit
	cd docker && $(MAKE) test-audit

PHONY: test-format
test-format:
	cd client && $(MAKE) test-format
	cd docker && $(MAKE) test-format

PHONY: test-lint
test-lint:
	cd client && $(MAKE) test-lint
	cd docker && $(MAKE) test-lint

PHONY: test-types
test-types:
	cd client && $(MAKE) test-types
	cd docker && $(MAKE) test-types

LICENSE:
	@echo "you must have a LICENSE file" 1>&2
	exit 1

LICENSE_HEADER:
	@echo "you must have a LICENSE_HEADER file" 1>&2
	exit 1

.PHONY: license
license: LICENSE LICENSE_HEADER
	cd client && npm ci && npm run license:fix
	cd docker && npm ci && npm run license:fix

.PHONY: test-license
test-license: LICENSE LICENSE_HEADER
	cd client && npm ci && npm run test:license
	cd docker && npm ci && npm run test:license











DOCKER_IMAGE?=opentutor-web-client
OPENTUTOR_CLIENT_VERSION?=latest

.PHONY docker-build:
docker-build:
	docker build \
		--file docker/Dockerfile \
		-t $(DOCKER_IMAGE) \
		--build-arg "OPENTUTOR_CLIENT_VERSION=$(OPENTUTOR_CLIENT_VERSION)" \
	.











TEST_E2E_DOCKER_COMPOSE=docker-compose
TEST_E2E_IMAGE_SNAPSHOTS_PATH?=cypress/snapshots
TEST_E2E_DOCKER_IMAGE_SNAPSHOTS_PATH?=/app/$(TEST_E2E_IMAGE_SNAPSHOTS_PATH)
TEST_E2E_HOST_IMAGE_SNAPSHOTS_PATH?=$(PWD)/client/$(TEST_E2E_IMAGE_SNAPSHOTS_PATH)


.PHONY: test-e2e-exec
test-e2e:
	$(TEST_E2E_DOCKER_COMPOSE) up -d
	$(TEST_E2E_DOCKER_COMPOSE) exec cypress npx cypress run

.PHONY: test-e2e-exec
test-e2e-exec:
	$(TEST_E2E_DOCKER_COMPOSE) exec -T cypress npx cypress run --env updateSnapshots=true

.PHONY: test-e2e-image-snapshots-clean
test-e2e-image-snapshots-clean:
	rm -rf ${TEST_E2E_HOST_IMAGE_SNAPSHOTS_PATH}

.PHONY: test-e2e-image-snapshots-copy
test-e2e-image-snapshots-copy:
	docker cp $(shell $(TEST_E2E_DOCKER_COMPOSE) ps -a -q cypress):$(TEST_E2E_DOCKER_IMAGE_SNAPSHOTS_PATH)/ $(TEST_E2E_HOST_IMAGE_SNAPSHOTS_PATH)

.PHONY: test-e2e-image-snapshots-update
test-e2e-image-snapshots-update:
	$(MAKE) test-e2e-image-snapshots-clean
	$(TEST_E2E_DOCKER_COMPOSE) build
	$(TEST_E2E_DOCKER_COMPOSE) up -d
	$(TEST_E2E_DOCKER_COMPOSE) exec cypress npx cypress run --env updateSnapshots=true
	rm -rf $(TEST_E2E_IMAGE_SNAPSHOTS_PATH)
	$(MAKE) test-e2e-image-snapshots-copy
