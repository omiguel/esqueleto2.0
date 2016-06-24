'use strict';
/**
 * Created by Osvaldo on 21/05/2016.
 */

const hub = require('../hub/hub.js');
const Mensagem = require('./mensagem.js');

class ControleModeBd {
  constructor(quem, model, ref) {
    this.hub = hub;
    this.mensagem = Mensagem;

    this.modelo = {
      ref: ref
    };
    this.sou = quem;

    this.criamodel(model);
  }

  /**
   * Se o atributo do model for um array, ele monta o array e cria o modelo
   * deste, depois joga dentro de callback, onde ele é setado dentro do array
   * do model que esta sendo criado.
   * @param model
   * @param cb
   */
  montaarray(model, cb) {
    let ret = {};

    for (let atributo in model) {
      if (model.hasOwnProperty(atributo)) {
        let tipo = model[atributo].instance;
        if (tipo == 'Array') {
          this.montaarray(model[atributo].schema.paths, function (res) {
            ret[atributo] = res;
          });
        } else {
          ret[atributo] = tipo;
        }
      }
    }

    cb(ret);

  }

  /**
   * Responsavel por criar um modelo da entidade que está no banco, mostrando
   * quais são os atributos e os tipos deles.
   * @param model
   */
  criamodel(model) {
    let ozmodel = model.paths;

    for (let atributo in ozmodel) {
      if(ozmodel.hasOwnProperty(atributo)){
        let tipo = ozmodel[atributo].instance;
        if (tipo == 'Array') {
          this.montaarray(ozmodel[atributo].schema.paths, function (res) {
            this.modelo[atributo] = [res];
          });
        }
        else if (atributo != '_id' && tipo == 'ObjectID') {
          this.modelo[atributo] = {referencia: ozmodel[atributo].options.ref};
        } else {
          this.modelo[atributo] = tipo;
        }
      }
    }
    let msg = new Mensagem(this, 'modelo', {
      nome: this.sou,
      modelo: this.modelo
    }, 'modelo');
    hub.emit(msg.getEvento(), msg);

  }

}

module.exports = ControleModeBd;