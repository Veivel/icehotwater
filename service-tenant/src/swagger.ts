const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketplace Tenant Service',
  },
  host: 'localhost:8884'
};

const outputFile = '../swagger.json';
const routes = ['./server.ts'];

swaggerAutogen(outputFile, routes, doc);