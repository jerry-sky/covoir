#!/bin/bash

# start the frontend program
cd frontend
npx ng serve &
f=$!

# start the backend program
cd ..
cd backend
npx nodemon -e ts -x 'ts-node index.ts' -w . &
b=$!

# kill both of these programs on exit
function finish() {
    kill $f $b
}
trap finish EXIT

# wait forever
cat >/dev/null
