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
    var me = this;

    let rtc = null;

    if (msg.getRtc() === me) {
      var dado = msg.getRes();
      switch (dado.tipo) {
        case 0:
          rtc = new rtcRoot(me.config, me);
          break;
        case 1:
          rtc = new rtcAdmin(me.config, me);
          break;
        case 2:
          rtc = new rtcComum(me.config, me);
          break;
      }

      me.emitePraInterface(msg);
    }
  }

}

/**
 * liga os eventos do cliente.
 */
RtcLoginManager.prototype.interfaceWiring = function () {
  var me = this;

  me.interfaceListeners['logar'] = me.daInterface.bind(me);

  me.ligaEventCli();
};

/**
 * liga os eventos do servidor.
 */
RtcLoginManager.prototype.wiring = function () {
  var me = this;

  me.listeners['usuario.error.logar'] = me.emitePraInterface.bind(me);
  me.listeners['usuario.senhaincorreta'] = me.emitePraInterface.bind(me);
  me.listeners['usuario.emailnaocadastrado'] = me.emitePraInterface.bind(me);
  me.listeners['usuario.login'] = me.trataLogin.bind(me);
  me.listeners['rtcLogin.destroy'] = me.destroy.bind(me);

  me.ligaEventServer();

};

module.exports = RtcLoginManager;