'use strict';
/**
 * Created by Osvaldo on 19/10/15.
 */


var Basico = require('./basicRtc.js');

class RtcComum extends Basico {
  constructor(conf, login) {
    super();
    this.config = conf;

    console.log('rtcComum', this.config.socket.id);

    this.hub.emit('rtcLogin.destroy', login);

    this.wiring();
    this.interfaceWiring();
  }

  /**
   * Liga os eventos do servidor.
   */
  wiring() {
    this.ligaEventServer();
  }

  /**
   * Liga os eventos da interface.
   */
  interfaceWiring() {
    this.ligaEventCli();
  }

}

module.exports = RtcComum;