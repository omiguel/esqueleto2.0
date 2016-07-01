'[use strict]';

/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive('navbar', [
  '$location',
  'getUserLogado',
  'setUserLogado',
  '$window',
  '$route',
  function($location, getUserLogado, setUserLogado, $window, $route) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: '../../views/navbar/navbar.html',

      link: function(scope, element) {
        var me = this;
        me.listeners = {};

        scope.usuariologado = null;

        /**
         * Criado por: Gustavo;
         *
         * Desloga usuario;
         *
         * @param local
         */
        scope.sair = function(local) {

          setUserLogado.setLogado(null);
          scope.usuariologado = null;

          SIOM.emit('exit');

          var wind = '/' + local;
          $location.path(wind);

          location.reload();

        };

        /**
         * Criado por: Gustavo;
         *
         * Troca de tela;
         *
         * @param local
         */
        scope.navega = function(local) {

          scope.usuariologado = getUserLogado.getLogado();

          var wind = '/' + local;
          $location.path(wind);

        };

        /**
         * Criado por: Gustavo;
         * Mostra menu do navbar para usuario;
         */
        var usuarioLogou = function() {
          scope.usuariologado = getUserLogado.getLogado();
        };

        var ready = function() {
          var msg = new Mensagem(this, 'idioma.read', null, 'idioma');
          SIOM.emitirServer(msg);
        };

        var retIdiomas = function (msg) {
          var dado = msg.getDado();
          console.log('chegou isso', dado);
        };

        /**
         * Criado por: Osvaldo
         * Funcao responsavel por ligar os eventos;
         */
        var wiring = function() {
          me.listeners['setarota'] = usuarioLogou.bind(me);
          me.listeners['idioma.readed'] = retIdiomas.bind(me);

          for (var name in me.listeners) {
            if (me.listeners.hasOwnProperty(name)) {

              SIOM.on(name, me.listeners[name]);

            }
          }

          ready();

        };

        wiring();

      }
    };
  }]);
