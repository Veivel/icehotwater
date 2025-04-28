# for development purposes only

npm i swagger-ui-express && npm i --save-dev @types/swagger-ui-express swagger-autogen
cp ../service-auth/src/swagger.ts ./src/swagger.ts
cp ../service-auth/Dockerfile ./Dockerfile
cp ../service-auth/tsconfig.json ./tsconfig.json

node ./src/swagger.ts
docker compose up --build