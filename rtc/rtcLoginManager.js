'use strict';
/**
 * Created by Osvaldo on 16/10/15.
 */

const Basico = require('./basicRtc.js');
const rtcRoot = require('./rtcRoot.js');
const rtcAdmin = require('./rtcAdmin');
const rtcComum = require('./rtcComum');

class RtcLoginManager extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf) {
    super();
    this.config = conf;

    console.log('rtcLogin', this.config.socket.id);

    this.wiring();
    this.interfaceWiring();
  }

  /**
   * Funcao que recebe o retorno do banco, se vier um usuario ele verifica
   * o tipo para iniciar o rtc que representa este user no server e informa a
   * interface, se nao veio usuario ele informa a interface.
   *
   * @param msg
   */
  trataLogin(msg) {

    let rtc = null;

    if (msg.getRtc() === this) {
      let dado = msg.getRes();
      switch (dado.tipo) {
        case 0:
          rtc = new rtcRoot(this.config, this);
          break;
        case 1:
          rtc = new rtcAdmin(this.config, this);
          break;
        case 2:
          rtc = new rtcComum(this.config, this);
          break;
      }

      this.emitePraInterface(msg);
    }
  }

  /**
   * liga os eventos do cliente.
   */
  interfaceWiring() {

    this.interfaceListeners['logar'] = this.daInterface.bind(this);

    this.ligaEventCli();
  }

  /**
   * liga os eventos do servidor.
   */
  wiring() {

    this.listeners['usuario.error.logar'] = this.emitePraInterface.bind(this);
    this.listeners['usuario.senhaincorreta'] = this.emitePraInterface.bind(this);
    this.listeners['usuario.emailnaocadastrado'] = this.emitePraInterface.bind(this);
    this.listeners['usuario.login'] = this.trataLogin.bind(this);
    this.listeners['rtcLogin.destroy'] = this.destroy.bind(this);

    this.ligaEventServer();

  }

}

module.exports = RtcLoginManager;