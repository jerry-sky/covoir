#!/bin/bash

cd backend

# clean
rm -rf dist

# initialize
git init dist
cd dist
heroku git:remote -a covoir
git pull heroku master
cd ..

# build
npx tsc -p tsconfig.json

# attach the Procfile containing the running command
cp Procfile dist

# attach the list of dependencies
cp package.json dist

cd dist

# deploy on Heroku
git add .
if [ "0" != "$(git status -s | wc -l)" ]; then
    # commit if there is anything to commit
    git commit -m 'deployed on '$(date -Iseconds)
    git push heroku master
else
    echo 'no changes'
fi
