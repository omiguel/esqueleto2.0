/**
 * Created by Osvaldo on 13/06/2016.
 */

var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/teste.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

/**
 * @constructor
 */
function teste(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

/**
 * recebe o manager atraves de heranca.
 */
utility.inherits(teste, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
teste.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    console.log(method);
    try {
        me[method](msg);
    }catch (e){
        console.log(e);
        me.emitManager(msg, '.error.manager', {err: e});
    }
};



/**
 * funcao responsavel por ligar os eventos escutados por esse documento.
 */
teste.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.teste.*'] = me.executaCrud.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }

};

module.exports = new teste();