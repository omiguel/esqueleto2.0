'[use strict]';
/**
 * Created by Gustavo on 30/06/2016.
 */
app.directive('modalretorno', [ function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      titulo: '=',
      texto: '=',
      modalpararetornar: '=',
      funcaoretorno: '=',

    },
    templateUrl: '../../../views/componentes/modalRetorno/' +
    'modalRetorno.html',

    link: function(scope, element, attrs) {

      var me = this;

      scope.titulo = '';
      scope.texto = '';
      scope.modalpararetornar = '';

      /**
       * Criado por: Gustavo;
       *
       * abre modal desejado;
       */
      scope.voltarModal = function() {

        if (false) {
          scope.executaFuncaoRetorno();
        } else {
          $('#' + scope.modalpararetornar).modal();
        }

      };

      scope.executaFuncaoRetorno = function() {

      };

    },

  };
}]);
