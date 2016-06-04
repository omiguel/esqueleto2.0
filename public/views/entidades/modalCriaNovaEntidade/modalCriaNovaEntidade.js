/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive("modalcrianovaentidade", [function() {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
            entidadeselecionada: "="
        },
        templateUrl: '../../../views/entidades/modalCriaNovaEntidade/modalCriaNovaEntidade.html',

        link: function(scope, element){

            /*
            * criado por: Gustavo
            * todo salva a entidade criado no banco
             */
            scope.salvarEntidade = function(){

                console.log("entidade criada", scope.entidadeselecionada.novaentidade);

            };

        }
    };
}]);
