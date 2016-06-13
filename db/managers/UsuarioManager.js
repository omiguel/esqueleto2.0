
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/usuario.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

/**
 * @constructor
 */
function usuariomanager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

/**
 * recebe o manager atraves de heranca.
 */
utility.inherits(usuariomanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
usuariomanager.prototype.executaCrud = function(msg){
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
 * busca um usuario peleo email, quando vem o retorno, verifica se a senha está correta.
 * caso nao venha nenhum atravez da busca pelo email, informa que o email nao esta cadastrado.
 * se a senha nao bater, informa que o email esta cadastrado mas a senha esta incorreta.
 * se der um erro no banco, avisa que o banco esta inoperavel e pede para aguardar ate que o sistema volte.
 *
 * @param msg
 */
usuariomanager.prototype.trataLogin = function(msg){
    var me = this;
    var dado = msg.getRes();

    this.model.findOne({'email': dado.email}, function(err, res){
        if(res){
            if(dado.senha == res.senha){
                res.senha = null;
                me.emitManager(msg, '.login', {res: res});
            } else {
                me.emitManager(msg, '.senhaincorreta', {res: null});
            }
        } else if(err){
            me.emitManager(msg, '.error.logar', {err: err});
        } else{
            me.emitManager(msg, '.emailnaocadastrado', {res: res});
        }
    });
};

/**
 * funcao que pega todos os usuario, menos os que estao definidos como root
 *
 * @param msg
 */
usuariomanager.prototype.getAllRootLess = function(msg){
    var me = this;

    this.model.find({"tipo": { $ne: 0 }},function(err, res){
        if(res){
            me.emitManager(msg, '.pegacadastrados', {res: retorno});
        } else{
            me.emitManager(msg, '.error.pegacadastrados', {err: err});
        }
    })
};

/**
 * quando o manager e iniciado, essa funcao verifica se ja existe um usuario no banco, se ainda nao ela cria o primeiro
 * que sera um root.
 */
usuariomanager.prototype.cadprimeirouser = function (idioma) {
    
    var user = {
        nome: 'admin',
        sobrenome: 'admin',
        email: 'admin',
        senha: 'admin',
        datanascimento: new Date(1988, 01, 02),
        sexo: 'masculino',
        numerocelular: '99476823',
        foto: 'caminhodafoto',
        tipo: 0,
        idioma: idioma
    };

    this.model.create(user, function (erro, ret) {
        if(ret){
            console.log('primeiro user criado', ret);
        } else {
            console.log('algo errado não deu certo', erro);
        }
    });
};

/**
 * funcao responsavel por ligar os eventos escutados por esse documento.
 */
usuariomanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.usuario.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.logar'] = me.trataLogin.bind(me);
    me.listeners['rtc.cadastrados'] = me.getAllRootLess.bind(me);
    me.listeners['criaprimeirouser'] = me.cadprimeirouser.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }

};

module.exports = new usuariomanager();