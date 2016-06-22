'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);
var expect = chai.expect;
var should = chai.should();

Feature('Login');

Scenario('Login into ISIS', function (I, loginPage) {
  loginPage.loginFail();
  loginPage.loginSuccess();
});

Scenario('Create new USER', function (I, loginPage, administracaoPage) {
  loginPage.loginSuccess();
  administracaoPage.goToAdministracao();

  //pause()
});





