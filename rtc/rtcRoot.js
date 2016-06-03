/**
 * Created by Osvaldo on 23/07/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
var fs = require('fs');
utility.inherits(RtcRoot, basico);

/**
 * recebe o socketId enviado pelo cliente.
 *
 * @param conf
 * @constructor
 */
function RtcRoot(conf){
    var me = this;
    me.config = conf;
    me.listeners = {};
    me.browserlisteners = {};

    console.log('rtcRoot', me.config.socket.id);

    hub.emit('rtcLogin.destroy');

    me.wiring();
    me.interfaceWiring();
}

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
 * liga os eventos do servidor.
 */
RtcRoot.prototype.wiring = function(){
    var me = this;

    me.listeners['usuario.created'] = me.emitePraInterface.bind(me);
    me.listeners['allmodels'] = me.emitePraInterface.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

/**
 * liga os eventos da interface.
 */
RtcRoot.prototype.interfaceWiring = function(){
    var me = this;

    me.browserlisteners['getallmodels'] = me.daInterface.bind(me);

    for(var name in me.browserlisteners){
        me.config.socket.on(name, me.browserlisteners[name]);
    }
};

module.exports = RtcRoot;