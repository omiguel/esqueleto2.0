'use strict'
/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive("navbar", ['$location', 'getUserLogado', 'setUserLogado', '$window', '$route', function ($location, getUserLogado, setUserLogado, $window, $route) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    templateUrl: '../../views/navbar/navbar.html',

    link: function (scope, element) {
      var me = this;
      me.listeners = {};

      scope.usuariologado = null;

      /**
       * criado por: Gustavo
       * desloga usuario
       */
      scope.sair = function (local) {

        setUserLogado.setLogado(null);
        scope.usuariologado = null;

        SIOM.emit('exit');

        var wind = "/" + local;
        $location.path(wind);

        location.reload();

      };

      /**
       * criado por: Gustavo
       * troca de tela
       */
      scope.navega = function (local) {

        scope.usuariologado = getUserLogado.getLogado();

        var wind = "/" + local;
        $location.path(wind);

      };

      /**
       * criado por: Gustavo
       * mostra menu do navbar para usuario
       */
      var usuarioLogou = function () {
        scope.usuariologado = getUserLogado.getLogado();
      };

      /**
       * funcao responsavel por ligar os eventos.
       */
      var wiring = function () {
        me.listeners['setarota'] = usuarioLogou.bind(me);

        for (var name in me.listeners) {
          if(me.listeners.hasOwnProperty(name)){

            SIOM.on(name, me.listeners[name]);

          }
        }

      };

      wiring();

    }
  };
}]);
