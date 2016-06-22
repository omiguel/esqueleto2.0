'use strict';
/**
 * Created by udesc on 20/06/2016.
 */

const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const busboy = require('connect-busboy');
const Banco = require('./db/');


class Aplicacao {
  constructor(pathConfig) {
    var me = this;
    this.config = require(pathConfig);
    this.app = express();
    this.http = http.Server(this.app);
    this.io = socketio(http);
    this.bd = new Banco(this.config.db);
    
    this.rtcLogin = require('./rtc/rtcLoginManager.js');
    



    this.app.set('view engine', 'ejs');
    this.app.set('views', path.resolve(__dirname + '/views'));
    this.app.use(express['static'](path.resolve(__dirname + '/public')));

    this.app.use(busboy());

    this.io.on('connection',function(socket) {
      console.log('chegou no socket', socket);
      let rtc = new this.rtcLogin({socket: socket});
    });

    this.http.listen(this.config.server.porta, function(err) {
      console.log('Rodando na porta ' + me.config.server.porta, err);
    });

    this.app.use('/image', express.static(path.resolve(__dirname + '/image/')));
    this.app.use('/favicon.ico', 
      express.static(path.resolve(__dirname + '/favicon.ico'))
    );


  }

  getConfig() {
    return this.config;
  }

}

module.exports = Aplicacao;