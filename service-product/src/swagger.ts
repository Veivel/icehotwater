const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketplace Product Service',
  },
  host: 'localhost:8883'
};

const outputFile = '../swagger.json';
const routes = ['./server.ts'];

swaggerAutogen(outputFile, routes, doc);