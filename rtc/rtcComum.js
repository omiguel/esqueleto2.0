'use strict';
var Basico = require('./basicRtc.js');

/**
 * @author Osvaldo <juniorsin2012@gmail.com>
 *
 */
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