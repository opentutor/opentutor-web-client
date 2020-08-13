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
	cd client && npm run license:fix
	cd docker && npm run license:fix

.PHONY: test-license
test-license: LICENSE LICENSE_HEADER
	cd client && npm run test:license
	cd docker && npm run test:license

node_modules/license-check-and-add:
	npm ci