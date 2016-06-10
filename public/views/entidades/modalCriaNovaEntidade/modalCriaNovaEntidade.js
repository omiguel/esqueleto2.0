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

            /**
            * criado/modificado por: Gustavo e Bosvaldo
            * salva a entidade criado no banco
             */
            scope.salvarEntidade = function(){

                //todo n deixar criar usuarios com o mesmo email

                var dado = {
                    nomeentidade: scope.entidadeselecionada.nome,
                    novaentidade: scope.entidadeselecionada.dadoentidade
                };

                var msg = new Mensagem(me, 'entidade.create', dado, 'entidade');
                SIOM.emitirServer(msg);

            };

        }
    };
}]);
