'use strict';

var Comun = require('./rtcComum.js');

/**
 * @author Osvaldo <juniorsin2012@gmail.com>
 *
 */
class RtcAdmin extends Comun {
  constructor(conf, login, rtcNome) {

    let nome = rtcNome ? rtcNome : 'admin';

    super(conf, login, nome);

    this.adminlisteners = {};
    this.admininterfaceListeners = {};

    this.adminWiring();
    this.adminInterfaceWiring();
  }

  /**
   * Liga os eventos do servidor.
   */
  adminWiring() {
    this.adminLigaEventServer();
  }

  /**
   * Liga os eventos da interface.
   */
  adminInterfaceWiring() {
    this.adminLigaEventCli();
  }

  /**
   * Remove todos os eventos que o cliente admim pode enviar para o server.
   */
  desconectCliAdmin() {
    for (let name in this.admininterfaceListeners) {
      if (this.admininterfaceListeners.hasOwnProperty(name)) {
        this.config.socket.removeListener(name,
          this.admininterfaceListeners[name]);
      }
    }

    this.admininterfaceListeners = null;
  }

  /**
   * Remove todos os eventos que o rtcadmin pode escutar no server.
   */
  desconectServerAdmin() {
    for (let name in this.adminlisteners) {
      if (this.adminlisteners.hasOwnProperty(name)) {
        this.hub.removeListener(name, this.adminlisteners[name]);
      }
    }

    this.adminlisteners = null;
  }

  /**
   * Ligas os eventos do listeners no hub.
   */
  adminLigaEventServer() {

    for (let name in this.adminlisteners) {
      if (this.adminlisteners.hasOwnProperty(name)) {
        this.hub.on(name, this.adminlisteners[name]);
      }
    }

  }

  /**
   * Liga os eventos do interfaceListeners no socket.
   */
  adminLigaEventCli() {

    for (let name in this.admininterfaceListeners) {
      if (this.admininterfaceListeners.hasOwnProperty(name)) {
        this.config.socket.on(name, this.admininterfaceListeners[name]);
      }
    }
  }

}

module.exports = RtcAdmin;