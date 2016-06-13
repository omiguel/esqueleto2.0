/**
 * Created by Osvaldo on 13/06/2016.
 */

var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/idioma.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

/**
 * @constructor
 */
function idiomamanager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

/**
 * recebe o manager atraves de heranca.
 */
utility.inherits(idiomamanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
idiomamanager.prototype.executaCrud = function(msg){
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
 * quando o manager e iniciado, essa funcao verifica se ja existe um usuario no banco, se ainda nao ela cria o primeiro
 * que sera um root.
 */
idiomamanager.prototype.cadprimeiroidioma = function () {
    this.model.find(function(err, res){
        if(res){
            if(res.length == 0){

                var idioma = {
                    nome: 'Pt-Br'
                };

                this.model.create(idioma, function (erro, ret) {
                    if(ret){
                        hub.emit('criaprimeirouser', ret);
                    } else {
                        console.log('algo errado não deu certo', erro);
                    }
                })
            }
        }
    });
};

/**
 * funcao responsavel por ligar os eventos escutados por esse documento.
 */
idiomamanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.idioma.*'] = me.executaCrud.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }

    me.cadprimeiroidioma();

};

module.exports = new idiomamanager();