/**
 * Created by Gustavo on 03/06/2016.
 */
app.directive("modalmostraentidade", [function() {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
            listaentidade: "=",
            selecionavardiretiva: '&callbackFn'
        },
        templateUrl: '../../../views/entidades/modalMostraEntidade/modalMostraEntidade.html',

        link: function(scope, element, attrs){

            scope.view = function(){
              //todo func view
            };
            
        }
    };
}]);
