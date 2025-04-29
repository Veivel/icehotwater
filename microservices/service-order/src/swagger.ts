const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketplace Order Service',
  },
  host: 'localhost:8882'
};

const outputFile = '../swagger.json';
const routes = ['./server.ts'];

swaggerAutogen(outputFile, routes, doc);