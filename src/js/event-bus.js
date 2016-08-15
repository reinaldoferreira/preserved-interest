/*
  Controls events across app
*/

const ee = require('event-emitter'),
emitter = ee({});

module.exports = emitter;
