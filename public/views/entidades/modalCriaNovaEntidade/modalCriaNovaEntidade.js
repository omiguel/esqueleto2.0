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
            var me = this;

            /*
            * criado por: Gustavo
            * todo salva a entidade criado no banco
             */
            scope.salvarEntidade = function(){
                var dado = {
                    nomeentidade: scope.entidadeselecionada.nome,
                    novaentidade: scope.entidadeselecionada.novaentidade
                };

                var msg = new Mensagem(me, 'entidade.create', dado, 'entidade');
                SIOM.emitirServer(msg);

            };

        }
    };
}]);
