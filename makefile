
dev:
	bash dev.sh

lint:
	npx eslint .

build:
	cd frontend
	ng build --prod
