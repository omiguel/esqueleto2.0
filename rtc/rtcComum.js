'use strict';
var Basico = require('./basicRtc.js');

/**
 * @author Osvaldo <juniorsin2012@gmail.com>
 *
 */
class RtcComum extends Basico {
  constructor(conf, login, rtcNome) {

    let nome = rtcNome ? rtcNome : 'comum';

    super(nome);
    this.config = conf;

    this.hub.emit('rtcLogin.destroy', login);

    this.wiring();
    this.interfaceWiring();
  }

  /**
   * Liga os eventos do servidor.
   */
  wiring() {
    this.listeners['usuariomodelread'] = this.emitePraInterface.bind(this);
    
    this.ligaEventServer();
  }

  /**
   * Liga os eventos da interface.
   */
  interfaceWiring() {
    this.interfaceListeners['usuariomodel'] = this.daInterface.bind(this);

    this.ligaEventCli();
  }

}

module.exports = RtcComum;