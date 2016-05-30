/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope', function ($scope) {

    var me = this;

    //guarda todas as entidades do banco
    $scope.entidades = {};
    //guarda a entidade selecionada assim como a nova criada
    $scope.entidadeSelecionada = {}

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

    /*
    * criado por: Osvaldo
    * todo comentar
    */
    var ready = function () {
        var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
        SIOM.emitirServer(msg);
    };

    /*
    * criado por: Osvaldo
    * todo comentar
    */
    var retallmodels = function (msg) {
        $scope.entidades = msg.getDado();
        $scope.$apply();
    };

    var wiring = function () {

        listeners['allmodels'] = retallmodels.bind(me);

        for(var name in listeners){
            SIOM.on(name, listeners[name]);
        }

        ready();
    };

    wiring();

}]);