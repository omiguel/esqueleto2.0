/**
 * Created by Gustavo on 21/05/2016.
 */
app.controller("entidadesController",['$scope', function ($scope) {

    var me = this;

    //guarda todas as entidades do banco
    $scope.entidades = {};
    //guarda a entidade selecionada assim como a nova criada
    $scope.entidadeSelecionada = {};
    //guarda a lista de entidades criada
    $scope.listaEntidade = [];
    //guarda o nome do modal de retorno
    $scope.modalTitulo = null;
    //guarda o texto do modal de retorno
    $scope.modalTexto = null;


    var listeners = {};

    /**
     * criado por: Gustavo
     * joga a entidade desejada dentro da variavel $scope.entidadeSelecionada
     * cria e popula objeto dadoentidade da variavel $scope.entidadeSelecionada
     */
    $scope.selecionaEntidade = function(entidadeNome, entidadeModelo, dadoEntidade){

        console.log("entidade selecionada",  entidadeNome, entidadeModelo, dadoEntidade);

        $scope.entidadeSelecionada = {
            nome: entidadeNome,
            modelo: entidadeModelo,
            dadoentidade: dadoEntidade
        };

        if(!dadoEntidade){
            for(var index in $scope.entidadeSelecionada.modelo){
                $scope.entidadeSelecionada.dadoentidade[index] = null;
            }
        }

    };

    /**
     * criado por: Osvaldo e Gustavo
     * todo Bosvaldo comenta isso daqui!!!
     */
    $scope.visualidasCadastradosEntidade = function (entidade) {

        $scope.listaEntidade = {
            nome: entidade.nome,
            modelo: entidade.modelo,
            lista: []
        };

        var dado = {
            nome: entidade.nome
        };
        var msg = new Mensagem(me, 'entidade.read', dado, 'entidade');
        SIOM.emitirServer(msg);
    };

    /**
     * funcao padrao pra todos os controllers, essa funcao faz os pedidos de tudo que precisa para que o controller
     * inicie sua view.
     */
    var ready = function () {
        var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
        SIOM.emitirServer(msg);
    };

    /**
     * essa funcao retorna todos os models criados no banco
     */
    var retallmodels = function (msg) {
        $scope.entidades = msg.getDado();
        $scope.$apply();
    };

    /**
     * criado/modificado por: Gustavo e Bosvaldo
     * retorna na interface que entidade foi criada
     */
    var retEntidadeCriada = function (msg) {

        $scope.modalTitulo = $scope.entidadeSelecionada.nome + " criado!";
        $scope.modalTexto = $scope.entidadeSelecionada.nome + " criado com sucesso!";

        $scope.$apply();

        $('#modalCriaEntidade').modal('hide');
        $('#modalRetornoEntidadeCriada').modal();

    };

    var retEntidadeDeletede = function (msg) {
        //todo, faça aqui gustafe.
        console.log('deletou aqui', msg);
    };

    /**
     * criado/modificado por: gustavo e Bosvaldo
     * retorno do banco com a lista de elementos da entidade requisitada
     */
    var retEntidadeReaded = function (msg) {

        $scope.listaEntidade.lista = angular.copy(msg.getDado());

        //todo remover depois, apenas usado para tirar __v
        for(var index in $scope.listaEntidade.lista){
            for(var procuraV in $scope.listaEntidade.lista[index]){
                if(procuraV == "__v"){
                    delete $scope.listaEntidade.lista[index][procuraV];
                }
            }
        }

        $scope.$apply();

        $('#modalMostraEntidade').modal();

    };

    var retEntidadeUpdated = function (msg) {
        //todo, isso é com vc gustafe.
        console.log('retornou no up', msg);
    };

    var cretedError = function (msg) {
        var dado = msg.getErro();
        //todo: criar um modal de erro, se o dado.code == 11000, significa que erro de email duplicado.
        //todo: se quiser ver o erro, esta no dado.errmsg.
        console.log('erro de email', dado);
    };

    var wiring = function () {

        listeners['allmodels'] = retallmodels.bind(me);
        listeners['entidade.created'] = retEntidadeCriada.bind(me);
        listeners['entidade.readed'] = retEntidadeReaded.bind(me);
        listeners['entidade.destroied'] = retEntidadeDeletede.bind(me);
        listeners['entidade.updated'] = retEntidadeUpdated.bind(me);
        listeners['entidade.error.created'] = cretedError.bind(me);

        for(var name in listeners){
            SIOM.on(name, listeners[name]);
        }

        ready();
    };

    wiring();

}]);