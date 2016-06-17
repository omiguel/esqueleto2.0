/**
 * Created by Osvaldo on 06/10/15.
 *
 * esse documento possui as funcoes basicas do bando, ele é herdado por todos os managers.
 */
var hub = require('../../hub/hub.js');

var types = require('../Banco.js').mongoose.Schema.Types;

/**
 * @constructor
 */
function Manager() {}


/**
 * cria um novo documento no banco.
 *
 * @param msg
 */
Manager.prototype.create = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.create(dados, function(err, res){
        if(res){
            me.emitManager(msg, '.created', {res: res});
        } else{
            me.emitManager(msg, '.error.created', {err: err});
        }
    })
};

/**
 * le um ou todos os documentos de uma determinada colecao no banco.
 *
 * @param msg
 */
Manager.prototype.read = function(msg){
    var me = this;
    var dados = msg.getRes();
    if(dados){
        if(dados._id) {
            this.model.findById(dados._id, function (err, res) {
                if (res) {
                    me.emitManager(msg, '.readed', {res: res});
                } else {
                    me.emitManager(msg, '.error.readed', {err: err});
                }
            })
        } else {
            this.model.find(function(err, res){
                if(res){
                    me.emitManager(msg, '.readed', {res: res});
                } else{
                    me.emitManager(msg, '.error.readed', {err: err});
                }
            })
        }
    } else{
        this.model.find(function(err, res){
            if(res){
                me.emitManager(msg, '.readed', {res: res});
            } else{
                me.emitManager(msg, '.error.readed', {err: err});
            }
        })
    }
};

/**
 * modifica um documento em uma determinada colecao.
 *
 * @param msg
 */
Manager.prototype.update = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.findByIdAndUpdate(dados._id, {$set: dados}, function(err, res){
        if(res){
            me.model.findById(dados._id, function(err, res){
                if(res){
                    me.emitManager(msg, '.updated', {res: res});
                } else{
                    me.emitManager(msg, '.error.readedupdated', {err: err});
                }
            });
        } else{
            me.emitManager(msg, '.error.updated', {err: err});
        }
    })
};

/**
 * destroi um documento em uma determinada colecao.
 *
 * @param msg
 */
Manager.prototype.destroy = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.remove({'_id': dados._id}, function(err, res){
        if(res){
            me.emitManager(msg, '.destroied', {res: res});
        } else{
            me.emitManager(msg, '.error.destroied', {err: err});
        }
    })
};

/**
 * funcao que utiliza a mesma mensagem para devolver ao mesmo rtc que solicitou determinada modificacao ou leitura em banco
 * ela serve para apenas quem solicitou receber a resposta.
 * padrao para todos os managers.
 *
 * @param msgAntiga
 * @param subEvt
 * @param dado
 */
Manager.prototype.emitManager = function(msgAntiga, subEvt, dado){
    var me = this;
    var evt = msgAntiga.getFlag()+subEvt;
    var retorno = msgAntiga.next(me, evt, dado, msgAntiga.getFlag());
    hub.emit(retorno.getEvento(), retorno);
};

module.exports = Manager;