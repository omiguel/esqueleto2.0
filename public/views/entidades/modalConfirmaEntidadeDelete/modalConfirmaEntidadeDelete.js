/**
 * Created by Gustavo on 09/06/2016.
 */
app.directive("modalconfirmaentidadedelete", [function() {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
        },
        templateUrl: '../../../views/entidades/modalConfirmaEntidadeDelete/modalConfirmaEntidadeDelete.html',

        link: function(scope, element){
            var me = this;

            /**
             * criado por: Gustavo
             * deleta entidade no banco
             */
            scope.delete = function(entidade){
                //todo deleta entidade banco
            };

        }
    };
}]);
