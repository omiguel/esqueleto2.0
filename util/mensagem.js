'use strict';

const clone = require('clone');
const util = require('./util.js');


/**
 * Id da mensagem mantido na propria classe, cada nova mensagem incremementa
 * este Id
 * @type {number}
 * @private
 */
var _idMessage = 0;

class Mensagem {
  /**
   * Define o modelo de estrutura dos dados sendo passado nos eventos.
   * Por definição, uma mensagem tem que vir de algum lugar, logo, source será
   * obrigatório mesmo na criação.
   * Partindo do principio que nenhuma mensagem pode ser modificada e reenviada,
   * o metodo "clone" presente na mensagem clonará a mensagem adicionando o
   * novo source.
   *
   * Quando um objeto tiver que modificar esta mensagem, deverá clona-la
   * (utilizar o método clone) e destruir a referencia local a essa, para
   * evitar efeitos colaterais.
   *
   * A date é criada automaticamente, porem no momento do clone, ela é copiada
   * da mensagem anterior.
   *
   * @param {object} source
   * @param {Rtc} rtc
   * @param {boolean} success
   * @param {object} valor
   */
  constructor(source, evento, dado, flag, rtc, idMsg) {
    if (util.isEmpty(source) || typeof source !== 'object') {
      throw new Error("Não é possivel criar uma mensagem sem um source");
    }

    /**
     * Id desta mensagem.
     * @type {number}
     * @private
     */
    this._id = idMsg ? idMsg : ++_idMessage;

    /**
     *  Objecto que criou a mensagem
     * @type {object}
     * @private
     */
    this._source = source;

    /**
     * Rtc que introduziu a mensagem no servidor e que será chamado em caso
     * de erros.
     *
     * @type {Rtc}
     * @private
     */
    this._rtc = rtc ? rtc : null;

    /**
     * Flag (opcional) para identificação de mensagem quando necessário.
     * @type {*}
     * @private
     */
    this._flag = util.isEmpty(flag) ? false : flag;

    this._evento = evento;

    /**
     * Payload da memensagem.
     *
     * @type {*}
     * @private
     */
    this._dado = dado;

    /**
     * Boolean indiciando se esta mensagem é valida ou não
     * @type {boolean}
     * @private
     */
    this._success = this._dado && this._dado.res ? true : false;
  }

  /**
   * Cria uma nova mensagem a partir desta mensagem, mantendo os dados
   * considerados unicos para as mensagens participantes, tais como: rtc e id
   * das mensagens participantes.
   *
   * @returns {Mensagem}
   */
  next(source, evento, dado, flag, rtc) {
    if (!rtc) {
      rtc = this.getRtc();
    }

    let msg = new Mensagem(source, evento, dado, flag, rtc, this.getId());
    return msg;
  }

  /**
   * Seta o id da mensagem (representa a mensagem e si que é unica, não este
   * objeto) que identifica ela e suas sucessoras.
   *
   * @param id
   */
  setId(id) {
    this._id = id;
  }

  /**
   * Seta um novo evento na mensagem.
   * @param evento
   */
  setEvento(evento) {
    this._evento = evento;
  }

  /**
   * Retorna o id da mensagem inicial que foi criada.
   * @returns {*}
   */
  getId() {
    return this._id;
  }

  /**
   * Clona a mensagem e injeta o novo source.
   * Sempre deve ser usado este metodo antes de reenvioar a mensagem.
   * Isto evitará qualquer problema com referencias erradas.
   *
   * @param source
   *
   * @returns {Mensagem}
   */
  clone(source) {
    if (source === null || source === void(0) || source === this._source) {
      throw new Error("É necessário colocar um novo source para a mensagem");
    }
    let msg = new Mensagem(source);
    if (this.isErro()) {
      msg.setErro(this.getErro());
    } else {
      msg.setFlag(this.getFlag());
      msg.setDado(clone(this.getDado()));

      msg.setRtc(this.getRtc());
    }
    return msg;
  }

  /**
   * Seta um valor de Mensagem que é considerado válido.
   *
   * @param {*} dado
   * @throws Error
   */
  setDado(dado) {
    if (dado === void(0)) throw new Error("Invalid number of paramaters");
    this._dado = dado;
    return this;
  }

  /**
   * Seta a variavel res dentro do dado.
   *
   * @param res
   * @returns {Mensagem}
   */
  setRes(res) {
    this._dado.res = res;
    this._success = res ? true : false;
    return this;
  }

  /**
   * Seta um valor de Mensagem que é o tranforma em invalido. Erro
   *
   * @param {Error} dado
   */
  setErro(err) {
    this._dado.err = err;
    this._success = err ? false : true;
    return this;
  }

  /**
   * Retorna o source da Mensagem
   * @returns {object}
   */
  getSource() {
    return this._source;
  }

  /**
   * Retorna o rtc da Mensagem
   * @returns {Rtc}
   */
  getRtc() {
    return this._rtc;
  }

  /**
   * Seta o rtc da Mensagem.
   *
   * @param rtc
   * @returns {Mensagem}
   */
  setRtc(rtc) {
    this._rtc = rtc;
    return this;
  }

  /**
   * Retorna o valor caso o Mensagem seja valido != error
   */
  getDado() {
    return this._dado;
  }

  /**
   * Retorno o res.
   *
   * @returns {*}
   */
  getRes() {
    return this._dado.res;
  }

  /**
   * Retorna um representação de erro, caso este objeto seja invalido == erro;
   * @returns {*}
   */
  getErro() {
    return this._dado.err;
  }

  /**
   * retorna o nome do evento.
   *
   * @returns {*|String}
   */
  getEvento() {
    return this._evento;
  }

  /**
   * Retorna true se este objeto representar um erro.
   *
   * @returns {boolean}
   */
  isErro() {
    return !this._success;
  }

  /**
   * Retorna se sucesso ou não.
   *
   * @returns {boolean|*}
   */
  isSuccess() {
    return this._success;
  }

  /**
   * Retorna a flag.
   * @returns {*}
   */
  getFlag() {
    return this._flag;
  }

  /**
   * Seta a uma nova flag.
   *
   * @param flag
   * @returns {Mensagem}
   */
  setFlag(flag) {
    this._flag = flag;
    return this;
  }

  /**
   * NÃO DEVE SER USADA DIRETAMENTE, USE Rtc#convertMessageFromServerToBrowser
   * Formata o retorno desta mensagem para o browser.
   *
   *
   * @returns {{success: {boolean}, dado: {object}, error: {object},
   * flag: {boolean}}}
   */
  toBrowser() {
    let ret = {
      success: this.isSuccess(),
      dado: this.getRes(),
      erro: this.getErro(),
      flag: this.getFlag(),
      evento: this.getEvento(),
    };

    return ret;
  }

  /**
   * Popula esta mensagem com a mensagem que veio do browser
   * Este método dever usado somente dentro do RTC, sendo que este será o
   * source desta mensagem
   *
   * _source => rtc
   * @param {mesnagem} msgb
   * @param {Rtc} rtc
   */
  fromBrowser(msg, rtc) {
    this.setRtc(rtc);
    this.setFlag(msg.flag);
    this.setEvento(msg.evento);
    let dado = {};
    if (msg.success) {
      dado.res = msg.dados;
    } else {
      dado.err = msg.erro;
    }
    this.setDado(dado);
  }

  /**
   * Transforma a mensagem que vem do browser para o server, porém apenas em
   * casos que se usa para entidades fieta especialmente para o EsqueLabTic.
   * @param msg
   * @param rtc
   * @param callback
   */
  fromBrowserEntidade(msg, rtc, callback) {
    this.setRtc(rtc);
    this.setFlag(msg.flag);
    var novoevento = msg.dados.nome + '.'
      + msg.evento.substr(msg.evento.lastIndexOf('.') + 1);
    this.setEvento(novoevento);
    let dado = {};
    if (msg.success) {
      dado.res = msg.dados.entidade;
    } else {
      dado.err = msg.erro;
    }
    this.setDado(dado);

    callback(this);
  }

}

module.exports = Mensagem;
