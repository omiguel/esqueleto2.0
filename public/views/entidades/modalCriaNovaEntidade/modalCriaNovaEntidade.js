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

            //-----------------VARIAVEIS DE VALIDACAO

            scope.emailErro = false;

            //---------------------------------------

            //lista da referencia do atributo
            scope.listareferencia = ['jose','joana'];

            /**
            * criado/modificado por: Gustavo e Bosvaldo
            * salva a entidade criado no banco
             */
            scope.salvarEntidade = function(){
                
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

                scope.emailErro = false;
            };

            /**
             * criado por: Gustavo e Osvaldo
             * retorno do banco, erro ao criar/atualizar usuario
             * dado.code == 11000, email duplicado
             */
            var cretedError = function (msg) {

                var dado = msg.getErro();

                if(dado.code != 11000){
                    console.log('erro desconhecido', dado);
                } else {
                    scope.$apply(function(){
                        scope.emailErro = true;
                    });
                }

            };

            /**
             * criado por: Gustavo
             * pega do banco a lista do atributo a se referenciar
             */
            scope.pegalistareferencia = function(referencia){
                console.log("referencia", referencia);
                //todo osvaldo pega lista referencia e joga em scope.listareferencia
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
