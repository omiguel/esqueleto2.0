/**
 * Created by Osvaldo on 19/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
utility.inherits(RtcComum, basico);

/**
 * recebe o socketId passado pelo cliente.
 *
 * @param conf
 * @constructor
 */
function RtcComum(conf, login){
    var me = this;
    me.config = conf;

    console.log('rtcComum', me.config.socket.id);
    
    hub.emit('rtcLogin.destroy', login);

    me.wiring();
    me.interfaceWiring();
}

/**
 * liga os eventos do servidor.
 */
RtcComum.prototype.wiring = function(){
    var me = this;

    me.ligaEventServer();
};

/**
 * liga os eventos da interface.
 */
RtcComum.prototype.interfaceWiring = function(){
    var me = this;

    me.ligaEventCli();
};

module.exports = RtcComum;