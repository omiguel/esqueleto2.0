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
            var listeners = {};

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

            /**
             * criado por: Gustavo e Osvaldo
             * retorno do banco, erro ao criar/atualizar usuario
             * dado.code == 11000, email duplicado
             */
            var cretedError = function (msg) {

                var dado = msg.getErro();

                $scope.modalTitulo = "atualiza/cria " + $scope.entidadeSelecionada.nome + " erro!";

                if(dado.code == 11000){
                    console.log('erro', dado);
                    $scope.modalTexto = "parece que o e-mail solicitado já esta cadastrado, favor usar outro e-mail!";
                } else {
                    $scope.modalTexto = "erro desconhecido " + dado;
                }

            };

            var wiring = function () {
                listeners['entidade.error.created'] = cretedError.bind(me);

                for(var name in listeners){
                    SIOM.on(name, listeners[name]);
                }
            };

            wiring();
        }
    };
}]);
