install: # install npm
	npm ci

start:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

test-coverage:#initilizing test-coverage
	npm test -- --coverage --coverageProvider=v8

lint:#initializing linter
	npx eslint .

lintfix:#fixing linter
	npx eslint . --fix 