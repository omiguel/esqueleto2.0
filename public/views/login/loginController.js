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

    function teste(pass) {
      console.log('antes de tudo', pass);

      var has = seguranca.hash(pass);
      console.log('senha em hash', has);

      var pct = seguranca.empacota(has);
      console.log('pct', pct);

      var dpct = sjcl.codec.utf8String.fromBits(pct);
      console.log('desempacotando', dpct);
      console.log('teste de igualdade', has === dpct);

      // {mode : "ccm || gcm || ocb2"}
      let t = seguranca.cifra(has);
      console.log('cifrado', t);
      let d = sjcl.decrypt(dpct, t);
      console.log('decifrado', d);

      console.log('teste com decifrado', has === d);

    }

    teste('comum');

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
      user.senha = seguranca.cifra(me.senhaHash);

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