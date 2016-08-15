/*
  Grab content.json via ajax
*/

const request = require('superagent'),
emitter = require('./event-bus.js');

request.get('http://localhost:3000/content.json').end((err, res) => {
  if(err) emitter.emit('error', err);
  emitter.emit('update', res.body);
});