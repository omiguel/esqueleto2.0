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
    },
    templateUrl: '../../../views/componentes/modalRetorno/' +
    'modalRetorno.html',

    link: function(scope, element, attrs) {

      var me = this;

      scope.titulo = '';
      scope.texto = '';
      scope.modalpararetornar = '';

      scope.abreModal = function() {
        $('#' + scope.modalpararetornar).modal();
      };

    },

  };
}]);
