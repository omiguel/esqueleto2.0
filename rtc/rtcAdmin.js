/**
 * Created by Osvaldo on 19/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
utility.inherits(RtcAdmin, basico);

/**
 * recebe o socktId passado pelo cliente.
 * 
 * @param conf
 * @constructor
 */
function RtcAdmin(conf){
    var me = this;
    me.config = conf;

    console.log('rtcAdmin', me.config.socket.id);
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

module.exports = RtcAdmin;