
dev:
	bash dev.sh

lint:
	npx eslint .
	cd frontend;\
	npx stylelint .

lintfix:
	npx eslint . --fix
	cd frontend;\
	npx stylelint . --fix

build:
	cd frontend
	ng build --prod
