/**
 * Created by Osvaldo on 06/10/15.
 */
var Mongoose = require('mongoose');
var hub = require('../hub/hub.js');

function Banco() {
    var me = this;
    var db;
    me.listeners = {};
    me.models = {};
    Mongoose.connect('mongodb://localhost/nomeDoBanco');
    this.mongoose = Mongoose;
    this.conectado = false;
    db = Mongoose.connection;
    db.on('error', function(err, val) {
        return console.log("error", err, val);
    });
    db.once('open', function() {
        me.wiring();
        this.conectado = true;
        hub.emit('banco.status.ready');
    });
}

/**
 * liga todos os eventos escutados por esse documento.
 */
Banco.prototype.wiring = function(){
    var me = this;

    me.listeners['rtc.usuario.*'] = me.repassaComando.bind(me);
    me.listeners['modelo'] = me.entidademodelo.bind(me);
    me.listeners['rtc.getallmodels'] = me.enviamodelscompletos.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
    hub.emit('banco.status.wired');
};

/**
 * funcao que envia para a interface todos os models do banco e seus atributos.
 *
 * @param msg
 */
Banco.prototype.enviamodelscompletos = function (msg) {
    var me = this;
    var retorno = msg.next(me, 'allmodels', {res: me.models}, msg.getFlag);
    hub.emit(retorno.getEvento(), retorno);
};

/**
 * quando um model do banco e criado esse documento escuta, pega o model que veio dentro da msg e salva em um array.
 *
 * @param msg
 */
Banco.prototype.entidademodelo = function (msg) {
    var me = this;
    var model = msg.getDado();
    console.log(model.nome);
    me.models[model.nome] = model;
};

/**
 * repassa todos os eventos basicos (crud).
 * 
 * @param msg
 */
Banco.prototype.repassaComando = function (msg) {
    var me = this;
    var novoEvento = 'banco.' + msg.getEvento();
    msg.setEvento(novoEvento);
    hub.emit(novoEvento, msg);
};

module.exports = new Banco();