'use strict';
/**
 * Created by Osvaldo on 13/06/2016.
 */

var Manager = require('./manager.js');
var Model = require('../../model/idioma.js');

class Idiomamanager extends Manager {
  constructor() {
    super();

    this.model = Model;
    this.wiring();

  }

  /**
   * Inicia o tratamento dos namespace dos eventos, method recebe o nome da
   * função que vai ser executada por meio da herança.
   */
  executaCrud(msg) {
    let method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.') + 1);
    try {
      this[method](msg);
    } catch (e) {
      this.emitManager(msg, '.error.manager', {err: e});
    }
  }

  /**
   * Quando o manager e iniciado, essa funcao verifica se ja existe um usuario
   * no banco, se ainda nao ela cria o primeiro que sera um root.
   */
  cadprimeiroidioma() {
    var me = this;
    this.model.find(function(err, res) {
      if (res) {
        if (res.length === 0) {

          var idioma = {
            nome: 'Pt-Br',
          };

          me.model.create(idioma, function(erro, ret) {
            if (ret) {
              me.hub.emit('criaprimeirouser', ret);
            } else {
              console.log('algo errado não deu certo', erro);
            }
          });
        }
      }
    });
  }

  /**
   * Funcao responsavel por ligar os eventos escutados por esse documento.
   */
  wiring() {
    this.listeners['banco.idioma.*'] = this.executaCrud.bind(this);

    this.ligaListeners();

    this.cadprimeiroidioma();

  }

}

module.exports = new Idiomamanager();