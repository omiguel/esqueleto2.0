'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 */
const Mongoose = require('mongoose');
const hub = require('../hub/hub.js');

class Banco{
  constructor() {
    let me = this;
    let db;
    me.listeners = {};
    me.models = {};

    this.mongoose = Mongoose;

    let conectado = false;

    db = this.mongoose.connection;

    db.on('error', function(err, val) {
      return console.log('error', err, val);
    });
    db.once('open', function() {
      me.wiring();
      conectado = true;
      hub.emit('banco.status.ready');
    });
  }
}

Banco.prototype.init = function(config) {
  this.mongoose.connect('mongodb://' + config.mongodb.local + '/' +
    config.mongodb.nomedobanco);
};

/**
 * Liga todos os eventos escutados por esse documento.
 */
Banco.prototype.wiring = function() {
  var me = this;

  me.listeners['rtc.usuario.*'] = me.repassaComando.bind(me);
  me.listeners['rtc.idioma.*'] = me.repassaComando.bind(me);
  me.listeners['rtc.teste.*'] = me.repassaComando.bind(me);
  me.listeners['modelo'] = me.entidademodelo.bind(me);
  me.listeners['rtc.getallmodels'] = me.enviamodelscompletos.bind(me);

  for (var name in me.listeners) {
    if (me.listeners.hasOwnProperty(name)) {
      hub.on(name, me.listeners[name]);
    }
  }
  hub.emit('banco.status.wired');
};

/**
 * Funcao que envia para a interface todos os models do banco e seus atributos.
 *
 * @param msg
 */
Banco.prototype.enviamodelscompletos = function(msg) {
  var me = this;
  var retorno = msg.next(me, 'allmodels', {res: me.models}, msg.getFlag);
  hub.emit(retorno.getEvento(), retorno);
};

/**
 * Quando um model do banco e criado esse documento escuta, pega o model que
 * veio dentro da msg e salva em um array.
 *
 * @param msg
 */
Banco.prototype.entidademodelo = function(msg) {
  var me = this;
  var model = msg.getDado();
  console.log(model.nome);
  me.models[model.nome] = model;
};

/**
 * Repassa todos os eventos basicos (crud).
 *
 * @param msg
 */
Banco.prototype.repassaComando = function(msg) {
  var novoEvento = 'banco.' + msg.getEvento();
  msg.setEvento(novoEvento);
  hub.emit(novoEvento, msg);
};

module.exports = new Banco();