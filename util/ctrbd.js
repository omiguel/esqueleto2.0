/**
 * Created by Osvaldo on 21/05/2016.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('./mensagem.js');

function controlemodelbd(quem, model, ref) {
    var me = this;
    me.modelo = {
        ref: ref
    };
    me.sou = quem;

    me.criamodel(model);
}

/**
 * Se o atributo do model for um array, ele monta o array e cria o modelo deste,
 * depois joga dentro de callback, onde ele é setado dentro do array do model que
 * esta sendo criado.
 * @param model
 * @param cb
 */
controlemodelbd.prototype.montaarray = function (model, cb) {
    var me = this;
    var ret = {};

    for(var atributo in model){
        var tipo = model[atributo].instance;
        if(tipo == 'Array'){
            me.montaarray(model[atributo].schema.paths, function (res) {
                ret[atributo] = res;
            });
        } else {
            ret[atributo] = tipo;
        }
    }

    cb(ret);

};

/**
 * responsavel por criar um modelo da entidade que está no banco, mostrando quais são
 * os atributos e os tipos deles.
 * @param model
 */
controlemodelbd.prototype.criamodel = function (model) {
    var me = this;
    var ozmodel = model.paths;

    for(var atributo in ozmodel){
        var tipo = ozmodel[atributo].instance;
        if(tipo == 'Array'){
            me.montaarray(ozmodel[atributo].schema.paths, function (res) {
                me.modelo[atributo] = [res];
            });
        }
        else if(atributo != '_id' && tipo == 'ObjectID'){
            me.modelo[atributo] = {referencia: ozmodel[atributo].options.ref};
        }else {
            me.modelo[atributo] = tipo;
        }
    }
    var msg = new Mensagem(me, 'modelo', {nome: me.sou, modelo: me.modelo}, 'modelo');
    hub.emit(msg.getEvento(), msg);

};

module.exports = controlemodelbd;