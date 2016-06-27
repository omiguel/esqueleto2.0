'[use strict]';
/**
 * Created by Gustavo on 09/06/2016.
 */
app.directive('modalconfirmaentidadedelete', [function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      entidadeselecionada: '=',
    },
    templateUrl: '../../../views/entidades/modalConfirmaEntidadeDelete/' +
    'modalConfirmaEntidadeDelete.html',

    link: function(scope) {
      var me = this;

      /**
       * Criado por: Gustavo;
       *
       * Deleta entidade no banco;
       *
       * @param entidade
       */
      scope.delete = function(entidade) {
        var dado = {
          nome: entidade.nome,
          entidade: entidade.dadoentidade,
        };
        var msg = new Mensagem(me, 'entidade.destroy', dado, 'entidade');
        SIOM.emitirServer(msg);
      };

    }
  };
}]);