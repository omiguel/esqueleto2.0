
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../steps_file.js')();
  },

  fields: {
    login: '#defaultLogin input[name="login"]',
    senha: '#defaultLogin input[name="senha"][type="password"]',
    scriptLogin: 'Ext.ComponentQuery.query(\'button[text=Login]\')[0].click()'
  },

  _setData(login, senha){
    I.fillField(this.fields.login, login);
    I.fillField(this.fields.senha, senha);
  },

  _execlogin: function(){
    I.executeScript(this.fields.scriptLogin);
  },

  _preValidation: function() {
    I.amOnPage('/');

    //var title = yield I.grabTitle();
    //title.should.be.equal("ISIS");

    I.waitForElement('#defaultLogin', 25);
    I.see('Login');
  },

  loginFail: function(){
    this._preValidation();
    this._setData('admin', 'firefox2');
    this._execlogin();
    I.see('Login ou senha não correspondem');
  },

  loginSuccess: function(){
    this._preValidation();
    this._setData('loginTeste', 'senhaTeste');
    this._execlogin();
    I.waitToHide('defaultLogin', 10);
  }

};
