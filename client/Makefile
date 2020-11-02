.env.development:
	@echo "DIALOG_ENDPOINT=https://dev-opentutor.pal3.org/dialog/" >> .env.development
	@echo "Set up  a default .env.development file"
	@echo "that configures DIALOG_ENDPOINT=https://dev-opentutor.pal3.org/dialog/."
	@echo "This file should not be committed. "
	@echo "Feel free to change to point to a local server if you're running one."

.PHONY: clean
clean:
	rm -rf .cache public node_modules

.PHONY: cypress-update-snapshots
cypress-update-snapshots:
	cd .. && $(MAKE) test-e2e-image-snapshots-update

.PHONY: develop
develop: .env.development node_modules/gatsby-cli
	npx gatsby develop

.PHONY: format
format: node_modules/prettier
	npm run format

node_modules/cypress:
	npm install --frozen-lockfile

node_modules/eslint:
	npm install --frozen-lockfile

node_modules/gatsby-cli:
	npm install --frozen-lockfile

node_modules/jest:
	npm install --frozen-lockfile

node_modules/prettier:
	npm install --frozen-lockfile

node_modules/typescript:
	npm install --frozen-lockfile

.PHONY: test
test: node_modules/jest
	npm run test

PHONY: test-all
test-all:
	$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-types

.PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format: node_modules/prettier
	npm run test:format

.PHONY: test-format
test-lint: node_modules/eslint
	npm run test:lint

.PHONY: test-types
test-types: node_modules/typescript
	npm run test:types

.PHONY: test-cypress
test-cypress: node_modules/cypress
	npm run test:cypress
