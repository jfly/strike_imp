'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8000,
  routes: {
    cors: true,
  },
});

server.register(require('inert'), err => {
  if(err) {
    throw err;
  }

  require('./routes')(server);

  server.start(err => {
    if(err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
