#!/bin/sh
set -e

echo "Running npm generate..."
npm run generate
echo "Running npm migrate..."
npm run migrate

# Start the application
exec node dist/src/server.js
