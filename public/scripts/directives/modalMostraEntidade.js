/**
 * Created by Gustavo on 03/06/2016.
 */
app.directive("modalmostraentidade", [function() {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
            listaentidade: "="
        },
        templateUrl: '../../partial/modalMostraEntidade.html',

        link: function(scope, element){

        }
    };
}]);
