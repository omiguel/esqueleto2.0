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

        // Lista de idiomas
        scope.listaidiomas = [];
        // Usuario logado
        scope.usuariologado = null;
        // Idioma atual
        scope.idiomaselecionado = {};

        /**
         * Criado por: Gustavo;
         *
         * seleciona um idioma;
         *
         * @param idioma;
         */
        scope.selecionaidioma = function(idioma) {
          scope.idiomaselecionado = angular.copy(idioma);
          // TODO tem q atualizar a pagina com novo idioma
          // TODO se usuario logado tem q atualizar usuario com novo idioma
        };

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
         *
         * Mostra menu do navbar para usuario;
         */
        var usuarioLogou = function() {
          scope.usuariologado = getUserLogado.getLogado();
          // TODO chamar
          // scope.selecionaidioma(getUserLogado.getLogado().idioma);
        };

        /**
         * Criado por Osvaldo;
         *
         * Pede pro banco lista de idiomas;
         */
        var ready = function() {
          var msg = new Mensagem(this, 'idioma.read', null, 'idioma');
          SIOM.emitirServer(msg);
        };

        /**
         * Criado por: Osvaldo;
         *
         * Retorna idiomas do banco;
         *
         * @param msg
         */
        var retIdiomas = function(msg) {

          scope.$apply(function() {
            scope.listaidiomas = msg.getDado();
            scope.idiomaselecionado = msg.getDado()[0];
          });

        };

        /**
         * Criado por: Osvaldo
         *
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

      },
    };
  }]);
