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
function RtcAdmin(conf, login){
    var me = this;
    me.config = conf;

    console.log('rtcAdmin', me.config.socket.id);

    hub.emit('rtcLogin.destroy', login);

    me.wiring();
    me.interfaceWiring();

}

/**
 * liga os eventos do servidor.
 */
RtcAdmin.prototype.wiring = function(){
    var me = this;

    me.ligaEventServer();
};

/**
 * liga os eventos da interface.
 */
RtcAdmin.prototype.interfaceWiring = function(){
    var me = this;

    me.ligaEventCli();
};

module.exports = RtcAdmin;