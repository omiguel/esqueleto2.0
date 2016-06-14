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

        for(var index in entidadeModelo){
            if(dadoEntidade[index] == null){
                dadoEntidade[index] = null;
            }
        }

        $scope.entidadeSelecionada = {
            nome: entidadeNome,
            modelo: entidadeModelo,
            dadoentidade: dadoEntidade
        };

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
     * criado por: Osvaldo
     * funcao padrao pra todos os controllers, essa funcao faz os pedidos de tudo que precisa para que o controller
     * inicie sua view.
     */
    var ready = function () {
        var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
        SIOM.emitirServer(msg);
    };

    /**
     * criado por: Osvaldo
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

        $('#modalRetorno').modal();
        $('#modalCriaEntidade').modal('toggle');

        $scope.$apply();

    };

    /**
     * criado/modificado por: Gustavo e Osvaldo
     * retorna na interface que entidade foi deletada
     */
    var retEntidadeDeletede = function (msg) {

        $scope.modalTitulo = "deleta " + $scope.entidadeSelecionada.nome;
        $scope.modalTexto = $scope.entidadeSelecionada.nome + " deletado com sucesso!";

        $('#modalRetorno').modal();

        $scope.$apply();

    };

    /**
     * criado/modificado por: Gustavo e Osvaldo
     * retorna na interface que entidade foi atualizada
     */
    var retEntidadeUpdated = function (msg) {

        $scope.modalTitulo = "atualiza " + $scope.entidadeSelecionada.nome;
        $scope.modalTexto = $scope.entidadeSelecionada.nome + " atualizado com sucesso!";

        $('#modalRetorno').modal();
        $('#modalCriaEntidade').modal('toggle');

        $scope.$apply();

    };

    /**
     * criado/modificado por: Gustavo e Bosvaldo
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

    var wiring = function () {

        listeners['allmodels'] = retallmodels.bind(me);
        listeners['entidade.created'] = retEntidadeCriada.bind(me);
        listeners['entidade.readed'] = retEntidadeReaded.bind(me);
        listeners['entidade.destroied'] = retEntidadeDeletede.bind(me);
        listeners['entidade.updated'] = retEntidadeUpdated.bind(me);

        for(var name in listeners){
            SIOM.on(name, listeners[name]);
        }

        ready();
    };

    wiring();

}]);