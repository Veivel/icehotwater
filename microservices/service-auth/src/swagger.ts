const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketplace Auth Service',
  },
  host: 'localhost:8881'
};

const outputFile = '../swagger.json';
const routes = ['./server.ts'];

swaggerAutogen(outputFile, routes, doc);