'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 *
 * esse documento possui as funcoes basicas do bando, ele é herdado por todos
 * os managers.
 */
const hub = require('../../../hub/hub.js');

class Manager {
  constructor() {
  }

  /**
   * Cria um novo documento no banco.
   *
   * @param msg
   */
  create(msg) {
    let me = this;
    let dados = msg.getRes();
    this.model.create(dados, function (err, res) {
      if (res) {
        me.emitManager(msg, '.created', {res: res});
      } else {
        me.emitManager(msg, '.error.created', {err: err});
      }
    });
  }

  /**
   * Le um ou todos os documentos de uma determinada colecao no banco.
   *
   * @param msg
   */
  read(msg) {
    let me = this;
    let dados = msg.getRes();
    if (dados) {
      if (dados._id) {
        this.model.findById(dados._id, function (err, res) {
          if (res) {
            me.emitManager(msg, '.readed', {res: res});
          } else {
            me.emitManager(msg, '.error.readed', {err: err});
          }
        });
      } else {
        this.model.find(function (err, res) {
          if (res) {
            me.emitManager(msg, '.readed', {res: res});
          } else {
            me.emitManager(msg, '.error.readed', {err: err});
          }
        });
      }
    } else {
      this.model.find(function (err, res) {
        if (res) {
          me.emitManager(msg, '.readed', {res: res});
        } else {
          me.emitManager(msg, '.error.readed', {err: err});
        }
      });
    }
  }

  /**
   * modifica um documento em uma determinada colecao.
   *
   * @param msg
   */
  updatefunction(msg) {
    var me = this;
    var dados = msg.getRes();
    this.model.findByIdAndUpdate(dados._id, {$set: dados}, function (err, res) {
      if (res) {
        me.model.findById(dados._id, function (err, res) {
          if (res) {
            me.emitManager(msg, '.updated', {res: res});
          } else {
            me.emitManager(msg, '.error.readedupdated', {err: err});
          }
        });
      } else {
        me.emitManager(msg, '.error.updated', {err: err});
      }
    });
  }

  /**
   * Destroi um documento em uma determinada colecao.
   *
   * @param msg
   */
  destroy(msg) {
    var me = this;
    var dados = msg.getRes();
    this.model.remove({'_id': dados._id}, function(err, res) {
      if (res) {
        me.emitManager(msg, '.destroied', {res: res});
      } else {
        me.emitManager(msg, '.error.destroied', {err: err});
      }
    });
  }

  /**
   * Funcao que utiliza a mesma mensagem para devolver ao mesmo rtc que
   * solicitou determinada modificacao ou leitura em banco ela serve para
   * apenas quem solicitou receber a resposta.
   * padrao para todos os managers.
   *
   * @param msgAntiga
   * @param subEvt
   * @param dado
   */
  emitManager(msgAntiga, subEvt, dado) {
    var evt = msgAntiga.getFlag() + subEvt;
    if (msgAntiga.getFlag() === 'referencia') {
      var eventoantigo = msgAntiga.getEvento();
      var novaflag = eventoantigo.slice(6, eventoantigo.lastIndexOf('.'));
      msgAntiga.setFlag(novaflag);
    }
    var retorno = msgAntiga.next(this, evt, dado, msgAntiga.getFlag());
    hub.emit(retorno.getEvento(), retorno);
  }

}

module.exports = Manager;