/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope', function ($scope) {

    var me = this;

    //guarda todas as entidades do banco
    $scope.entidades = {};
    //guarda a entidade selecionada assim como a nova criada
    $scope.entidadeSelecionada = {};
    //guarda o nome do modal de retorno
    $scope.modalTitulo = null;
    //guarda o texto do modal de retorno
    $scope.modalTexto = null;


    var listeners = {};

    /*
     * criado por: Gustavo
     * joga a entidade desejada dentro da variavel $scope.entidadeSelecionada
     * cria e popula objeto novaentidade da variavel $scope.entidadeSelecionada
     */
    $scope.selecionaEntidade = function(entidade){

        $scope.entidadeSelecionada = angular.copy(entidade);
        $scope.entidadeSelecionada.novaentidade = {};

        for(var index in $scope.entidadeSelecionada.modelo){
            $scope.entidadeSelecionada.novaentidade[index] = null;
        }

    };

    $scope.visualidasCadastradosEntidade = function (entidade) {
        var dado = {
            nomeentidade: entidade.nome
        };
        var msg = new Mensagem(me, 'entidade.read', dado, 'entidade');
        SIOM.emitirServer(msg);
    };

    /*
     * funcao padrao pra todos os controllers, essa funcao faz os pedidos de tudo que precisa para que o controller
     * inicie sua view.
     */
    var ready = function () {
        var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
        SIOM.emitirServer(msg);
    };

    /*
     * essa funcao retorna todos os models criados no banco
     */
    var retallmodels = function (msg) {
        $scope.entidades = msg.getDado();
        $scope.$apply();
    };

    var retEntidadeCriada = function (msg) {

        $scope.modalTitulo = "Titulo Bolado";
        $scope.modalTexto = "Texto Bolado";

        $('#modalRetornoEntidadeCriada').modal();

        console.log('veio aqui pq criou algo', msg);
    };

    var retEntidadeReaded = function (msg) {
        //todo, gusbixa tem que setar no modal mostra entidade...
        console.log('veio aqui pq criou algo', msg);
    };

    var wiring = function () {

        listeners['allmodels'] = retallmodels.bind(me);
        listeners['entidade.created'] = retEntidadeCriada.bind(me);
        listeners['entidade.readed'] = retEntidadeReaded.bind(me);

        for(var name in listeners){
            SIOM.on(name, listeners[name]);
        }

        ready();
    };

    wiring();

}]);