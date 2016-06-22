'use strict';
/**
 * Created by Osvaldo on 13/06/2016.
 */

const Manager = require('./manager.js');
const utility = require('util');
const Model = require('../../model/teste.js');
const hub = require('../../../hub/hub.js');

class Testemanager extends Manager {
  constructor() {
    super();

    this.model = Model;
    this.listeners = {};

    this.wiring();
  }

  /**
   * Inicia o tratamento dos namespace dos eventos, method recebe o nome da
   * função que vai ser executada por meio da herança.
   */
  executaCrud(msg) {
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.') + 1);
    try {
      me[method](msg);
    } catch (e) {
      console.log(e);
      me.emitManager(msg, '.error.manager', {err: e});
    }
  }

  /**
   * Funcao responsavel por ligar os eventos escutados por esse documento.
   */
  wiring() {
    var me = this;
    me.listeners['banco.teste.*'] = me.executaCrud.bind(me);

    for (var name in me.listeners) {
      if (me.listeners.hasOwnProperty(name)) {
        hub.on(name, me.listeners[name]);
      }
    }

  }

}

module.exports = new Testemanager();