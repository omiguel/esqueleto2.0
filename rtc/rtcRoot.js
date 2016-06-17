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
function RtcRoot(conf, login){
    var me = this;
    me.config = conf;

    console.log('rtcRoot', me.config.socket.id);

    hub.emit('rtcLogin.destroy', login);

    me.wiring();
    me.interfaceWiring();

}

/**
 * liga os eventos do servidor.
 */
RtcRoot.prototype.wiring = function(){
    var me = this;

    me.listeners['allmodels'] = me.emitePraInterface.bind(me);
    me.listeners['entidade.created'] = me.emitePraInterface.bind(me);
    me.listeners['entidade.readed'] = me.emitePraInterface.bind(me);
    me.listeners['entidade.destroied'] = me.emitePraInterface.bind(me);
    me.listeners['entidade.updated'] = me.emitePraInterface.bind(me);
    me.listeners['entidade.error.created'] = me.emitePraInterface.bind(me);
    me.listeners['referencia.readed'] = me.emitePraInterface.bind(me);

    me.ligaEventServer();
};

/**
 * essa função esta adaptada para repassar o crud de qualquer entidade por um evento unico.
 * @param msgDoBrowser
 */
RtcRoot.prototype.crudentidade = function (msgDoBrowser) {
    var me = this;
    var mensagem = new Mensagem(me); //source == this
    mensagem.fromBrowserEntidade(msgDoBrowser, me, function (msg) {
        console.log('no callback', msg);
        hub.emit('rtc.'+msg.getEvento(), msg);
    }); //rtc == this
};

/**
 * funcao responsavel por solicitar a leitura de qualquer referencia de algum model
 * quando o usuario desejar criar um novo modelo com referencia.
 * @param msg
 */
RtcRoot.prototype.readreferencia = function (msg) {
    var me = this;
    var msgserver = me.convertMessageFromBrowserToServer(msg);
    var evt = msgserver.getRes();
    msgserver.setEvento(evt.referencia+'.read');
    hub.emit('rtc.'+msgserver.getEvento(), msgserver);
};

/**
 * liga os eventos da interface.
 */
RtcRoot.prototype.interfaceWiring = function(){
    var me = this;

    me.interfaceListeners['getallmodels'] = me.daInterface.bind(me);
    me.interfaceListeners['entidade.create'] = me.crudentidade.bind(me);
    me.interfaceListeners['entidade.read'] = me.crudentidade.bind(me);
    me.interfaceListeners['entidade.destroy'] = me.crudentidade.bind(me);
    me.interfaceListeners['entidade.update'] = me.crudentidade.bind(me);
    me.interfaceListeners['referencia.read'] = me.readreferencia.bind(me);

    me.ligaEventCli();
};

module.exports = RtcRoot;