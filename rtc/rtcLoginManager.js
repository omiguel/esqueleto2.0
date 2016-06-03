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
    me.listeners = {};
    me.interfaceListeners = {};

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
                new rtcRoot(me.config);
                break;
            case 1:
                new rtcAdmin(me.config);
                break;
            case 2:
                new rtcComum(me.config);
                break;
        }

        me.emitePraInterface(msg);
    }
};

/**
 * destroy o objeto, desconectando ele de todos os eventos.
 */
RtcLoginManager.prototype.destroy = function(){
    var me = this;

    me.desconectCli();
    me.desconectServer();

};

/**
 * desconecta os eventos que vem do cliente.
 */
RtcLoginManager.prototype.desconectCli = function () {
    var me = this;

    for(var name in me.interfaceListeners){
        me.config.socket.removeListener(name, me.config.socket[name]);
    }
};

/**
 * desconecta os eventos que vem do servidor.
 */
RtcLoginManager.prototype.desconectServer = function () {
    var me = this;

    for(var name in me.listeners){
        hub.removeListener(name, me.listeners[name]);
    }
};

/**
 * liga os eventos do cliente.
 */
RtcLoginManager.prototype.interfaceWiring = function(){
    var me = this;

    me.interfaceListeners['logar'] = me.daInterface.bind(me);

    for(var name in me.interfaceListeners){
        me.config.socket.on(name, me.interfaceListeners[name]);
    }
};

/**
 * liga os eventos do servidor.
 */
RtcLoginManager.prototype.wiring = function(){
    var me = this;

    me.listeners['usuario.error.logar'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.invaliduser'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.login'] = me.trataLogin.bind(me);
    me.listeners['rtcLogin.destroy'] = me.destroy.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = RtcLoginManager;