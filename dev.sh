#!/bin/bash

# start the frontend program
cd frontend
npx ng serve &
f=$!

# start the backend program
cd ..
cd backend
npx nodemon -e ts -x 'npx tsc -p tsconfig.json && node dist/backend || exit 1' -w . &
b=$!

# kill both of these programs on exit
function finish() {
    kill $f $b
}
trap finish EXIT

# wait forever
cat >/dev/null
