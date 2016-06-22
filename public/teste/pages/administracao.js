
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../steps_file.js')();
  },

  _validateInterface(){
    I.see('Usuários');
    I.see('Serviços');
    I.see('Pacotes');
    I.see('Clientes');
    I.see('Tipos de caixa');
    I.see('Tipos de cabo');
    I.see('Hardware - Calix');
  },

  goToAdministracao(){
    I.click('.home-bto.home-administracao');
    this._validateInterface();
  },

  goToUsuario(){
    
  }


};
