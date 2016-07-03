'use strict';
const Mensagem = require('../util/mensagem.js');
const hub = require('../hub/hub.js');



/**
 * @author Osvaldo <juniorsin2012@gmail.com>
 *
 */
class BasicRtc {
  
  constructor(rtcNome) {
    this.hub = hub;
    this.mensagem = Mensagem;
    this.listeners = {};
    this.interfaceListeners = {};

    // Todo, temporario...
    console.log('conectado no rtc', rtcNome);
  }

  /**
   * Destroy o objeto, desconectando ele de todos os eventos.
   */
  destroy() {
    this.desconectCli();
    this.desconectServer();
    if (this.adminlisteners) {
      this.desconectCliAdmin();
      this.desconectServerAdmin();
    }
  }

  /**
   * Desconecta os eventos que vem do cliente.
   */
  desconectCli() {

    for (let name in this.interfaceListeners) {
      if (this.interfaceListeners.hasOwnProperty(name)) {
        this.config.socket.removeListener(name, this.interfaceListeners[name]);
      }
    }

    this.interfaceListeners = null;
  }

  /**
   * Desconecta os eventos que vem do servidor.
   */
  desconectServer() {

    for (let name in this.listeners) {
      if (this.listeners.hasOwnProperty(name)) {
        this.hub.removeListener(name, this.listeners[name]);
      }
    }

    this.listeners = null;

  }

  /**
   * Ligas os eventos do listeners no hub.
   */
  ligaEventServer() {

    for (let name in this.listeners) {
      if (this.listeners.hasOwnProperty(name)) {
        this.hub.on(name, this.listeners[name]);
      }
    }

  }

  /**
   * Liga os eventos do interfaceListeners no socket.
   */
  ligaEventCli() {
    this.interfaceListeners['disconnect'] = this.destroy.bind(this);

    for (let name in this.interfaceListeners) {
      if (this.interfaceListeners.hasOwnProperty(name)) {
        this.config.socket.on(name, this.interfaceListeners[name]);
      }
    }
  }

  /**
   * Envia a msg para a interface.
   *
   * @param msg
   */
  emitePraInterface(msg) {
    if (msg.getRtc() === this) {
      var msgToBrowser = BasicRtc.convertMessageFromServerToBrowser(msg);
      this.config.socket.emit('retorno', msgToBrowser);
    }
  }

  /**
   * Converte a msg que vem do cliente para o padrao de masg do servidor.
   *
   * @param msgDoBrowser
   * @returns {Mensagem}
   */
  convertMessageFromBrowserToServer(msgDoBrowser) {
    let mensagem = new this.mensagem(this); // Source == this
    mensagem.fromBrowser(msgDoBrowser, this); // Rtc == this
    return mensagem;

  }

  /**
   * Converte a msg do servidor para um msg entendida pelo cliente.
   *
   * @param mensagem
   * @returns {{success, dado, erro, flag, evento}|{success: {boolean},
   * dado: {object}, error: {object}, flag: {boolean}}}
   */
  static convertMessageFromServerToBrowser(mensagem) {
    return mensagem.toBrowser();
  }

  /**
   * Recebe uma msg que vem da interface e a repassa por meio de evento.
   * @param msgDoBrowser
   */
  daInterface(msgDoBrowser) {
    let me = this;
    this.hub.emit('rtc.' + msgDoBrowser.evento,
      me.convertMessageFromBrowserToServer(msgDoBrowser));
  }

}


module.exports = BasicRtc;