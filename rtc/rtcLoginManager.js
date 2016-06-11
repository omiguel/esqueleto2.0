/**
 * Created by Osvaldo on 16/10/15.
 */

var hub = require('../hub/hub.js');
var utility = require('util');
var Mensagem = require('../util/mensagem.js');
var basico = require('./basicRtc.js');
var rtcRoot = require('./rtcRoot.js');
var rtcAdmin = require('./rtcAdmin');
var rtcComum = require('./rtcComum');
utility.inherits(RtcLoginManager, basico);

/**
 * recebe o socketId passado pelo cliente.
 *
 * @param conf
 * @constructor
 */
function RtcLoginManager(conf){
    var me = this;
    me.config = conf;

    console.log('rtcLogin', me.config.socket.id);

    me.wiring();
    me.interfaceWiring();
}

/**
 * Funcao que recebe o retorno do banco, se vier um usuario ele verifica o tipo para iniciar o rtc que representa
 * este user no server e informa a interface, se nao veio usuario ele informa a interface.
 *
 * @param msg
 */
RtcLoginManager.prototype.trataLogin = function(msg){
    var me = this;

    if(msg.getRtc() == me){
        var dado = msg.getRes();
        switch (dado.tipo){
            case 0:
                new rtcRoot(me.config, me);
                break;
            case 1:
                new rtcAdmin(me.config, me);
                break;
            case 2:
                new rtcComum(me.config, me);
                break;
        }

        me.emitePraInterface(msg);
    }
};

/**
 * liga os eventos do cliente.
 */
RtcLoginManager.prototype.interfaceWiring = function(){
    var me = this;

    me.interfaceListeners['logar'] = me.daInterface.bind(me);

    me.ligaEventCli();
};

/**
 * liga os eventos do servidor.
 */
RtcLoginManager.prototype.wiring = function(){
    var me = this;

    me.listeners['usuario.error.logar'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.senhaincorreta'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.emailnaocadastrado'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.login'] = me.trataLogin.bind(me);
    me.listeners['rtcLogin.destroy'] = me.destroy.bind(me);

    me.ligaEventServer();

};

module.exports = RtcLoginManager;