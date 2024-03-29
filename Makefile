DOCKER_IMAGE?=opentutor-web-client
OPENTUTOR_CLIENT_VERSION?=latest
TEST_E2E_DOCKER_COMPOSE=docker-compose
TEST_E2E_IMAGE_SNAPSHOTS_PATH?=cypress/snapshots
TEST_E2E_DOCKER_IMAGE_SNAPSHOTS_PATH?=/app/$(TEST_E2E_IMAGE_SNAPSHOTS_PATH)
TEST_E2E_HOST_IMAGE_SNAPSHOTS_PATH?=$(PWD)/cypress/$(TEST_E2E_IMAGE_SNAPSHOTS_PATH)
LICENSE_CONFIG?="license-config.json"

.PHONY: clean
clean:
	cd client && $(MAKE) clean
	cd docker && $(MAKE) clean

.PHONY: develop
develop:
	cd client && $(MAKE) develop

.PHONY docker-build:
docker-build:
	docker build \
		--file docker/Dockerfile \
		-t $(DOCKER_IMAGE) \
		--build-arg "OPENTUTOR_CLIENT_VERSION=$(OPENTUTOR_CLIENT_VERSION)" \
	.

.PHONY: pretty
pretty: node_modules/prettier
	npm run format

LICENSE:
	@echo "you must have a LICENSE file" 1>&2
	exit 1

LICENSE_HEADER:
	@echo "you must have a LICENSE_HEADER file" 1>&2
	exit 1

.PHONY: format
format: node_modules/prettier LICENSE LICENSE_HEADER
	npm run license:fix && npm run format

.PHONY: license
license: LICENSE LICENSE_HEADER
	npm run license:fix

.PHONY: test
test:
	cd client && $(MAKE) test

.PHONY: test-all
test-all:
	#$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-license
	$(MAKE) test-types
	# $(MAKE) test

node_modules/license-check-and-add:
	npm ci

node_modules/prettier:
	npm ci

.PHONY: test-audit
test-audit:
	cd client && $(MAKE) test-audit

.PHONY: test-format
test-format: node_modules/prettier
	npm run test:format

.PHONY: test-lint
test-lint:
	cd client && $(MAKE) test-lint

.PHONY: test-types
test-types:
	cd client && $(MAKE) test-types


.PHONY: test-license
test-license: LICENSE LICENSE_HEADER
	npm run test:license
	
.PHONY: license-deploy
license-deploy: node_modules/license-check-and-add LICENSE LICENSE_HEADER
	LICENSE_CONFIG=${LICENSE_CONFIG} npm run license:deploy

.PHONY: test-e2e
test-e2e:
	cd cypress && npx cypress run --headless --env "CYPRESS_SNAPSHOT_DIFF_DIR=$(TEST_E2E_IMAGE_SNAPSHOTS_PATH)/__diff_output__"

.PHONY: test-e2e-image-snapshots-clean
test-e2e-image-snapshots-clean:
	rm -rf $(TEST_E2E_HOST_IMAGE_SNAPSHOTS_PATH)

.PHONY: test-e2e-exec-image-snapshots-update
test-e2e-exec-image-snapshots-update:
	cd cypress && npx cypress run --env updateSnapshots=true

.PHONY: test-e2e-image-snapshots-update
test-e2e-image-snapshots-update:
	$(MAKE) test-e2e-image-snapshots-clean
	$(MAKE) test-e2e-exec-image-snapshots-update
	$(MAKE) test-e2e-image-snapshots-copy

.PHONY: test-e2e-up
test-e2e-up:
	$(TEST_E2E_DOCKER_COMPOSE) up -d
