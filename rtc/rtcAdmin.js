'use strict';
/**
 * Created by Osvaldo on 19/10/15.
 */


var Comun = require('./rtcComum.js');

class RtcAdmin extends Comun {
  constructor(conf, login) {
    super(conf, login);

    console.log('rtcAdmin', this.config.socket.id);

    this.adminlisteners = {};
    this.admininterfaceListeners = {};

    this.adminWiring();
    this.adminInterfaceWiring();
  }

  /**
   * Liga os eventos do servidor.
   */
  adminWiring() {
    this.ligaEventServer();
  }

  /**
   * Liga os eventos da interface.
   */
  adminInterfaceWiring() {
    this.ligaEventCli();
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