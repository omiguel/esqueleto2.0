'use strict';
/**
 * Created by Osvaldo on 23/07/15.
 */

const Mensagem = require('../util/mensagem.js');
const Basico = require('./basicRtc.js');

class RtcRoot extends Basico {

  constructor(conf, login) {
    super();
    this.config = conf;

    console.log('RtcRoot', this.config.socket.id);

    this.hub.emit('rtcLogin.destroy', login);

    this.wiring();
    this.interfaceWiring();

  }

  /**
   * Liga os eventos do servidor.
   */
  wiring() {

    this.listeners['allmodels'] = this.emitePraInterface.bind(this);
    this.listeners['entidade.created'] = this.emitePraInterface.bind(this);
    this.listeners['entidade.readed'] = this.emitePraInterface.bind(this);
    this.listeners['entidade.destroied'] = this.emitePraInterface.bind(this);
    this.listeners['entidade.updated'] = this.emitePraInterface.bind(this);
    this.listeners['entidade.error.created'] = this.emitePraInterface
      .bind(this);
    this.listeners['referencia.readed'] = this.emitePraInterface.bind(this);

    this.ligaEventServer();
  }

  /**
   * Essa função esta adaptada para repassar o crud de qualquer entidade por
   * um evento unico.
   * @param msgDoBrowser
   */
  crudentidade(msgDoBrowser) {
    let me = this;
    let mensagem = new Mensagem(this); // Source == this
    mensagem.fromBrowserEntidade(msgDoBrowser, this, function (msg) {
      me.hub.emit('rtc.' + msg.getEvento(), msg);
      console.log('quem eh o hub', me.hub);
    }); // Rtc == this
  }

  /**
   * Funcao responsavel por solicitar a leitura de qualquer referencia de
   * algum model quando o usuario desejar criar um novo modelo com referencia.
   *
   * @param msg
   */
  readreferencia(msg) {
    let me = this;
    let msgserver = me.convertMessageFromBrowserToServer(msg);
    let dados = msgserver.getRes();

    for (let index in dados) {
      if (dados.hasOwnProperty(index)) {
        let evt = dados[index].referencia;
        let msg = new Mensagem(me, evt + '.read', {res: dados[index]}, 
          msgserver.getFlag(), me);
        hub.emit('rtc.' + msg.getEvento(), msg);
      }
    }
  }

  /**
   * Liga os eventos da interface.
   */
  interfaceWiring() {

    this.interfaceListeners['getallmodels'] = this.daInterface.bind(this);
    this.interfaceListeners['entidade.read'] = this.crudentidade.bind(this);
    // this.interfaceListeners['entidade.read'] = this.crudentidade.bind(this);
    // this.interfaceListeners['entidade.destroy'] = this.crudentidade.bind(this);
    // this.interfaceListeners['entidade.update'] = this.crudentidade.bind(this);
    this.interfaceListeners['referencia.read'] = this.readreferencia.bind(this);

    this.ligaEventCli();
  };

}

module.exports = RtcRoot;