'[use strict]';
/**
 * Created by Osvaldo on 05/10/15.
 */

// Var sjcl = require('sjcl');

app.controller('loginController', [
  '$scope',
  '$location',
  'setUserLogado',
  '$route',
  'seguranca',
  function ($scope, $location, setUserLogado, $route, seguranca) {

    var me = this;

    function teste(login) {
      console.log('antes de tudo', login);

      var has = seguranca.hash(login.senha);
      login.senha = has;
      console.log('senha em hash', login);

      var pct = seguranca.empacota(JSON.stringify(login));
      console.log('pct', pct);

      var dpct = sjcl.codec.utf8String.fromBits(pct);
      console.log('desempacotando', dpct);

      var obj = JSON.parse(dpct);

      let aqui = sjcl.encrypt(obj.senha, JSON.stringify(obj), {mode: 'ocb2'});
      console.log('aquiiii', aqui);

      let outrod = sjcl.decrypt(obj.senha, aqui);
      console.log('decifrado', outrod);

    }

    let logsc = {
      nome: 'osvaldo',
      senha: 'admin'
    };

    teste(logsc);

    me.listeners = {};
    // Senha codificada
    me.senhaHash = null;


    // ----------------USADO APENAS PARA AGILIZAR LOGIN
    $scope.usuario = {
      email: 'admin',
      senha: 'admin',
    };
    // ------------------------------------------------

    // -------VARIAVEIS DE VALIDACAO
    $scope.validoSenha = true;
    $scope.validoEmailCadastrado = true;
    $scope.validoServer = true;
    // -----------------------------

    me.wind = '/home';

    /**
     * Criado por: Gustavo
     *
     * Transforma senha em hash
     */
    $scope.criaHash = function() {
      me.senhaHash = seguranca.hash(angular.copy($scope.usuario.senha));
    };

    /**
     * Criado por: Osvaldo;
     *
     * Tenta logar usuario;
     */
    $scope.logar = function() {

      me.senhaHash = seguranca.hash(angular.copy($scope.usuario.senha));

      var user = angular.copy($scope.usuario);
      user.senha = me.senhaHash;
      var nonce = Math.floor((Math.random() * 1000000000) + 1);
      user.nonce = nonce;

        user = seguranca.cifra(user);

      console.log('user', user);

      var dec = JSON.parse(sjcl.decrypt(me.senhaHash, user));

      console.log('decifra', dec);

      console.log('nonce verify', nonce, dec.nonce+1);
      return;

      var msg = new Mensagem(me, 'logar', user, 'usuario');
      SIOM.logar(msg);

    };

    /**
     * Criado por: Osvaldo;
     *
     * quando o usuario entra, joga o usuario logado globalmente.
     *
     * @param msg
     */
    me.logou = function(msg) {

      setUserLogado.setLogado(msg.getDado());
      SIOM.emit('setarota', msg.getDado().tipo);

    };

    /**
     * Criado por: Osvaldo;
     *
     * destroy a interface.
     */
    me.destroy = function() {
      for (var name in me.listeners) {
        if (me.listeners.hasOwnProperty(name)) {

          SIOM.removeListener(name, me.listeners[name]);

        }
      }
    };

    /**
     * Criado por: Osvaldo;
     *
     * Troca rota;
     */
    me.nextView = function() {
      $location.path(me.wind);
      $route.reload();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de erro do server;
     *
     * @param msg
     */
    me.serverError = function(msg) {
      $scope.validoServer = false;
      $scope.$apply();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de email nao cadastrado;
     *
     * @param msg
     */
    me.invalidUser = function(msg) {
      $scope.validoEmailCadastrado = false;
      $scope.$apply();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de senha incorreta;
     *
     * @param msg
     */
    me.senhaincorreta = function(msg) {
      $scope.validoSenha = false;
      $scope.$apply();
    };

    /**
     * Criado por: Gustavo;
     *
     * Alterna entre mostra formulario de cadastro e formulario de login;
     *
     * @param alterna
     * @param esconde
     * @param mostra
     */
    $scope.trocaLoginCadastro = function(alterna, esconde, mostra) {

      $('.' + esconde).animate({width: 'toggle'},350, function() {
        $('.' + mostra).animate({width: 'toggle'},350);
      });

    };

    me.wiring = function() {
      me.listeners['usuario.login'] = me.logou.bind(me);
      me.listeners['usuario.error.logar'] = me.serverError.bind(me);
      me.listeners['usuario.emailnaocadastrado'] = me.invalidUser.bind(me);
      me.listeners['usuario.senhaincorreta'] = me.senhaincorreta.bind(me);
      me.listeners['rotasetada'] = me.nextView.bind(me);

      for (var name in me.listeners) {
        if (me.listeners.hasOwnProperty(name)) {

          SIOM.on(name, me.listeners[name]);

        }
      }

    };

    me.wiring();

  }]);