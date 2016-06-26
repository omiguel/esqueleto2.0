'use strict';

const Manager = require('./manager.js');
const utility = require('util');
const Model = require('../../model/usuario.js');
const hub = require('../../../hub/hub.js');
const sjcl = require('sjcl');

class UsuarioManager extends Manager {
  constructor() {
    super();

    this.sjcl = sjcl;

    this.model = Model;
    this.listeners = {};

    this.wiring();

    this.teste('osvaldo');

  }

  teste(pass) {
    // {mode : "ccm || gcm || ocb2"}
    let t = this.sjcl.encrypt(pass, pass, {mode : "ocb2"});
    console.log('cifra', t);
    let d = this.sjcl.decrypt(pass, t);
    console.log('decifra', d);
  }

  /**
   * Inicia o tratamento dos namespace dos eventos, method recebe o nome da
   * função que vai ser executada por meio da herança.
   */
  executaCrud(msg) {
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.') + 1);
    try {
      me[method](msg);
    } catch (e) {
      me.emitManager(msg, '.error.manager', {err: e});
    }
  }

  /**
   * Busca um usuario peleo email, quando vem o retorno, verifica se a senha
   * está correta.
   * caso nao venha nenhum atravez da busca pelo email, informa que o email nao
   * esta cadastrado.
   * se a senha nao bater, informa que o email esta cadastrado mas a senha esta
   * incorreta.
   * se der um erro no banco, avisa que o banco esta inoperavel e pede para
   * aguardar ate que o sistema volte.
   *
   * @param msg
   */
  trataLogin(msg) {
    var me = this;
    var dado = msg.getRes();

    this.model.findOne({'email': dado.email}, function (err, res) {
      if (res) {
        if (dado.senha === res.senha) {
          res.senha = null;
          me.emitManager(msg, '.login', {res: res});
        } else {
          me.emitManager(msg, '.senhaincorreta', {res: null});
        }
      } else if (err) {
        me.emitManager(msg, '.error.logar', {err: err});
      } else {
        me.emitManager(msg, '.emailnaocadastrado', {res: res});
      }
    });
  }

  /**
   * Funcao que pega todos os usuario, menos os que estao definidos como root
   *
   * @param msg
   */
  getAllRootLess(msg) {
    var me = this;

    this.model.find({"tipo": {$ne: 0}}, function (err, res) {
      if (res) {
        me.emitManager(msg, '.pegacadastrados', {res: res});
      } else {
        me.emitManager(msg, '.error.pegacadastrados', {err: err});
      }
    });
  }

  /**
   * Quando o manager e iniciado, essa funcao verifica se ja existe um usuario
   * no banco, se ainda nao ela cria o primeiro que sera um root.
   */
  cadprimeirouser(idioma) {

    let user = {
      nome: 'admin',
      sobrenome: 'admin',
      email: 'admin',
      senha: '21232f297a57a5a743894a0e4a801fc3',
      datanascimento: new Date(1988, 1, 2),
      sexo: 'masculino',
      numerocelular: '99476823',
      foto: 'caminhodafoto',
      tipo: 0,
      idioma: idioma
    };

    this.model.create(user, function (erro, ret) {
      if (ret) {
        console.log('primeiro user criado', ret);
      } else {
        console.log('algo errado não deu certo', erro);
      }
    });
  }

  /**
   * Funcao responsavel por ligar os eventos escutados por esse documento.
   */
  wiring() {
    var me = this;
    me.listeners['banco.usuario.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.logar'] = me.trataLogin.bind(me);
    me.listeners['rtc.cadastrados'] = me.getAllRootLess.bind(me);
    me.listeners['criaprimeirouser'] = me.cadprimeirouser.bind(me);

    for (var name in me.listeners) {
      if (me.listeners.hasOwnProperty(name)) {
        hub.on(name, me.listeners[name]);
      }
    }

  }

}

module.exports = new UsuarioManager();