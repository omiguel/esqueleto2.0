/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive("modalcrianovaentidade", [function() {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
            entidadeselecionada: "=",
            confirmasenha: "="
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
                var method = null;

                var dado = {
                    nome: scope.entidadeselecionada.nome,
                    entidade: scope.entidadeselecionada.dadoentidade
                };

                if(dado.entidade._id){
                    method = 'update'
                } else {
                    method = 'create'
                }

                var msg = new Mensagem(me, 'entidade.'+method, dado, 'entidade');
                SIOM.emitirServer(msg);

            };

        }
    };
}]);
