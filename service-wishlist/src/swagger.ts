const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketplace Wishlist Service',
  },
  host: 'localhost:8885'
};

const outputFile = '../swagger.json';
const routes = ['./server.ts'];

swaggerAutogen(outputFile, routes, doc);