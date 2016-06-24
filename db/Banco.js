'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 */
const Mongoose = require('mongoose');
const hub = require('../hub/hub.js');

class Banco {
  constructor() {

    let db;
    this.listeners = {};
    this.models = {};
    this.hub = hub;

    this.mongoose = Mongoose;

    this.conectado = false;

    db = this.mongoose.connection;

    db.on('error', function (err, val) {
      return console.log('error', err, val);
    });
    db.once('open', this.dbOpen.bind(this));
  }

  init(config) {
    this.mongoose.connect('mongodb://' + config.mongodb.local + '/' +
      config.mongodb.nomedobanco);
  }

  dbOpen() {
      this.wiring();
      this.conectado = true;
      this.hub.emit('banco.status.ready');
  }

  /**
   * Liga todos os eventos escutados por esse documento.
   */
  wiring() {

    this.listeners['rtc.usuario.*'] = this.repassaComando.bind(this);
    this.listeners['rtc.idioma.*'] = this.repassaComando.bind(this);
    this.listeners['rtc.teste.*'] = this.repassaComando.bind(this);
    this.listeners['modelo'] = this.entidademodelo.bind(this);
    this.listeners['rtc.getallmodels'] = this.enviamodelscompletos.bind(this);

    for (var name in this.listeners) {
      if (this.listeners.hasOwnProperty(name)) {
        this.hub.on(name, this.listeners[name]);
      }
    }
    this.hub.emit('banco.status.wired');
  }

  /**
   * Funcao que envia para a interface todos os models do banco e seus atributos.
   *
   * @param msg
   */
  enviamodelscompletos(msg) {
    var retorno = msg.next(this, 'allmodels', {res: this.models}, msg.getFlag());
    this.hub.emit(retorno.getEvento(), retorno);
  }

  /**
   * Quando um model do banco e criado esse documento escuta, pega o model que
   * veio dentro da msg e salva em um array.
   *
   * @param msg
   */
  entidademodelo(msg) {
    var model = msg.getDado();
    console.log(model.nome);
    this.models[model.nome] = model;
  }

  /**
   * Repassa todos os eventos basicos (crud).
   *
   * @param msg
   */
  repassaComando(msg) {
    var novoEvento = 'banco.' + msg.getEvento();
    msg.setEvento(novoEvento);
    this.hub.emit(novoEvento, msg);
  }

}

module.exports = new Banco();