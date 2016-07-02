'use strict';
/**
 * Created by udesc on 20/06/2016.
 */
const path = require('path');
const chai = require('chai');
const chaihttp = require('chai-http');
const HttpStatus = require('http-status-codes');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;
const App = require('../aplicacao.js');
const Hub = require('../hub/hub.js');

const SocketMocha = require('./SocketMock');

const RTCLogin = require('../rtc/rtcLoginManager');

let app = null;
let express = null;


describe('Teste da aplicacao', function () {
  before(function (done) {
    Hub.on('app.ready', function (app) {
      express = app.express;
      done();
    });
    app = new App('./config.json');

  });


  it('meu primeiro teste', function (done) {
    let socketMocha = new SocketMocha();
    var rtcLogin = new RTCLogin({socket: socketMocha});

    Hub.on('logar', function (msg) {
      done();
    });


    //simulando um click de login do cliente no
    socketMocha.emit('logar',{event:'logar'});

  });


  after(function (done) {
    console.log('executei depois do teste');

    done();
  });
});



