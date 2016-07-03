'use strict';

const Admin = require('./rtcAdmin.js');

/**
 * @author Osvaldo <juniorsin2012@gmail.com>
 *
 *   @extends {RtcAdmin}
 * 
 */
class RtcRoot extends Admin {

  constructor(conf, login) {

    super(conf, login, 'root');

    this.rootlisteners = {};
    this.rootinterfaceListeners = {};

    this.rootWiring();
    this.rootInterfaceWiring();

  }

  /**
   * Essa função esta adaptada para repassar o crud de qualquer entidade por
   * um evento unico.
   * @param msgDoBrowser
   */
  crudentidade(msgDoBrowser) {
    let me = this;
    let mensagem = new this.mensagem(this); // Source == this
    mensagem.fromBrowserEntidade(msgDoBrowser, this, function(msg) {
      me.hub.emit('rtc.' + msg.getEvento(), msg);
    }); // Rtc == this
  }

  /**
   * Funcao responsavel por solicitar a leitura de qualquer referencia de
   * algum model quando o usuario desejar criar um novo modelo com referencia.
   *
   * @param msg
   */
  readreferencia(msg) {
    let msgserver = this.convertMessageFromBrowserToServer(msg);
    let dados = msgserver.getRes();

    for (let index in dados) {
      if (dados.hasOwnProperty(index)) {
        let evt = dados[index].referencia;
        let msg = new this.mensagem(this, evt + '.read', {res: dados[index]},
          msgserver.getFlag(), this);
        this.hub.emit('rtc.' + msg.getEvento(), msg);
      }
    }
  }

  /**
   * Desliga todos os listeners que os clientes root podem enviar para o server
   */
  desconectCliRoot() {
    for (let name in this.rootinterfaceListeners) {
      if (this.rootinterfaceListeners.hasOwnProperty(name)) {
        this.config.socket.removeListener(name,
          this.rootinterfaceListeners[name]);
      }
    }

    this.rootinterfaceListeners = null;
  }

  /**
   * Remove todos os eventos que o rtcroot pode escutar do server.
   */
  desconectServerRoot() {
    for (let name in this.rootlisteners) {
      if (this.rootlisteners.hasOwnProperty(name)) {
        this.hub.removeListener(name, this.rootlisteners[name]);
      }
    }

    this.rootlisteners = null;
  }

  /**
   * Ligas os eventos do listeners no hub.
   */
  rootLigaEventServer() {

    for (let name in this.rootlisteners) {
      if (this.rootlisteners.hasOwnProperty(name)) {
        this.hub.on(name, this.rootlisteners[name]);
      }
    }

  }

  /**
   * Liga os eventos do interfaceListeners no socket.
   */
  rootLigaEventCli() {

    for (let name in this.rootinterfaceListeners) {
      if (this.rootinterfaceListeners.hasOwnProperty(name)) {
        this.config.socket.on(name, this.rootinterfaceListeners[name]);
      }
    }
  }

  /**
   * Liga os eventos da interface.
   */
  rootInterfaceWiring() {

    this.rootinterfaceListeners['getallmodels'] = this.daInterface
      .bind(this);
    this.rootinterfaceListeners['entidade.create'] = this.crudentidade
      .bind(this);
    this.rootinterfaceListeners['entidade.read'] = this.crudentidade.bind(this);
    this.rootinterfaceListeners['entidade.destroy'] = this.crudentidade
      .bind(this);
    this.rootinterfaceListeners['entidade.update'] = this.crudentidade
      .bind(this);
    this.rootinterfaceListeners['referencia.read'] = this.readreferencia
      .bind(this);

    this.rootLigaEventCli();
  }

  /**
   * Liga os eventos do servidor.
   */
  rootWiring() {

    this.rootlisteners['allmodels'] = this.emitePraInterface.bind(this);
    this.rootlisteners['entidade.created'] = this.emitePraInterface.bind(this);
    this.rootlisteners['entidade.readed'] = this.emitePraInterface.bind(this);
    this.rootlisteners['entidade.destroied'] = this.emitePraInterface
      .bind(this);
    this.rootlisteners['entidade.updated'] = this.emitePraInterface.bind(this);
    this.rootlisteners['entidade.error.created'] = this.emitePraInterface
      .bind(this);
    this.rootlisteners['referencia.readed'] = this.emitePraInterface.bind(this);

    this.rootLigaEventServer();
  }

}

module.exports = RtcRoot;