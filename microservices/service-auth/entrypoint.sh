#!/bin/sh
set -e

echo "Running npm generate..."
npm run generate
echo "Running npm migrate..."
npm run migrate

# Start the application
node dist/src/server.js &
node dist/src/generateAdminToken.js &
wait %1
