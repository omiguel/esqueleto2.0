'use strict';
/**
 * Created by Osvaldo on 16/10/15.
 */
const Mensagem = require('../util/mensagem.js');
const hub = require('../hub/hub.js');

class BasicRtc {
  constructor() {
    this.hub = hub;
    this.mensagem = Mensagem;
    this.listeners = {};
    this.interfaceListeners = {};
  }

  /**
   * Destroy o objeto, desconectando ele de todos os eventos.
   */
  destroy(login) {
    let me = this;
    if (login === me) {
      this.desconectCli();
      this.desconectServer();
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
  }

  /**
   * Desconecta os eventos que vem do servidor.
   */
  desconectServer() {

    for (let name in this.listeners) {
      if (this.listeners.hasOwnProperty(name)) {
        hub.removeListener(name, this.listeners[name]);
      }
    }

  }

  /**
   * Ligas os eventos do listeners no hub.
   */
  ligaEventServer() {

    for (let name in this.listeners) {
      if (this.listeners.hasOwnProperty(name)) {
        hub.on(name, this.listeners[name]);
      }
    }

  }

  /**
   * Liga os eventos do interfaceListeners no socket.
   */
  ligaEventCli() {

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
    let me = this;
    if (msg.getRtc() === me) {
      var msgToBrowser = me.convertMessageFromServerToBrowser(msg);
      me.config.socket.emit('retorno', msgToBrowser);
    }
  }

  /**
   * Converte a msg que vem do cliente para o padrao de masg do servidor.
   *
   * @param msgDoBrowser
   * @returns {Mensagem}
   */
  convertMessageFromBrowserToServer(msgDoBrowser) {

    let me = this;
    let mensagem = new Mensagem(me); // Source == this
    mensagem.fromBrowser(msgDoBrowser, me); // Rtc == this
    return mensagem;

  }

  /**
   * Converte a msg do servidor para um msg entendida pelo cliente.
   *
   * @param mensagem
   * @returns {{success, dado, erro, flag, evento}|{success: {boolean},
   * dado: {object}, error: {object}, flag: {boolean}}}
   */
  convertMessageFromServerToBrowser(mensagem) {

    let msgb = mensagem.toBrowser();
    return msgb;
  }

  /**
   * Recebe uma msg que vem da interface e a repassa por meio de evento.
   * @param msgDoBrowser
   */
  daInterface(msgDoBrowser) {
    let me = this;
    hub.emit('rtc.' + msgDoBrowser.evento,
      me.convertMessageFromBrowserToServer(msgDoBrowser));
  }

}


module.exports = BasicRtc;