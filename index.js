'use strict';
/**
 * Created by Osvaldo Miguel Junior on 22/07/15.
 */

const App = require('./Aplicacao.js');

let app = new App('./config.json');

app.io.on('connection',function(socket) {
  console.log('chegou no socket', socket);
  let rtc = new this.rtcLogin({socket: socket});
});