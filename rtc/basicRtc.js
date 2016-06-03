/**
 * Created by Osvaldo on 16/10/15.
 */
var Mensagem = require('../util/mensagem.js');
var hub = require('../hub/hub.js');

/**
 * @constructor
 */
function BasicRtc(){
    var me = this;
}

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