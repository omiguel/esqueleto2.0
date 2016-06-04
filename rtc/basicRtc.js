/**
 * Created by Osvaldo on 16/10/15.
 */
var Mensagem = require('../util/mensagem.js');
var hub = require('../hub/hub.js');

/**
 * @constructor
 */
function BasicRtc(){}

BasicRtc.prototype.listeners = {};
BasicRtc.prototype.interfaceListeners = {};

/**
 * destroy o objeto, desconectando ele de todos os eventos.
 */
BasicRtc.prototype.destroy = function(login){
    var me = this;
    if(login == me){
        me.desconectCli();
        me.desconectServer();
    }

};

/**
 * desconecta os eventos que vem do cliente.
 */
BasicRtc.prototype.desconectCli = function () {
    var me = this;

    for(var name in me.interfaceListeners){
        me.config.socket.removeListener(name, me.interfaceListeners[name]);
    }
};

/**
 * desconecta os eventos que vem do servidor.
 */
BasicRtc.prototype.desconectServer = function () {
    var me = this;

    for(var name in me.listeners){
        hub.removeListener(name, me.listeners[name]);
    }

};

/**
 * ligas os eventos do listeners no hub.
 */
BasicRtc.prototype.ligaEventServer = function () {
    var me = this;

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

/**
 * liga os eventos do interfaceListeners no socket.
 */
BasicRtc.prototype.ligaEventCli = function () {
    var me = this;

    for(var name in me.interfaceListeners){
        me.config.socket.on(name, me.interfaceListeners[name]);
    }
};

/**
 * envia a msg para a interface.
 *
 * @param msg
 */
BasicRtc.prototype.emitePraInterface = function(msg){
    var me = this;
    if(msg.getRtc() == me){
        var msgToBrowser = me.convertMessageFromServerToBrowser(msg);
        me.config.socket.emit('retorno',msgToBrowser);
    }
};

/**
 * converte a msg que vem do cliente para o padrao de masg do servidor.
 *
 * @param msgDoBrowser
 * @returns {Mensagem}
 */
BasicRtc.prototype.convertMessageFromBrowserToServer = function(msgDoBrowser){
    var me = this;
    var mensagem = new Mensagem(me); //source == this
    mensagem.fromBrowser(msgDoBrowser, me); //rtc == this
    return mensagem;

};

/**
 * converte a msg do servidor para um msg entendida pelo cliente.
 *
 * @param mensagem
 * @returns {{success, dado, erro, flag, evento}|{success: {boolean}, dado: {object}, error: {object}, flag: {boolean}}}
 */
BasicRtc.prototype.convertMessageFromServerToBrowser = function(mensagem){
    var msgb = mensagem.toBrowser();
    return msgb;
};

/**
 * recebe uma msg que vem da interface e a repassa por meio de evento.
 * @param msgDoBrowser
 */
BasicRtc.prototype.daInterface = function(msgDoBrowser){
    var me = this;
    hub.emit('rtc.'+msgDoBrowser.evento, me.convertMessageFromBrowserToServer(msgDoBrowser));
};

module.exports = BasicRtc;