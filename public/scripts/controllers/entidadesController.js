/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope', function ($scope) {
    var me = this;

    $scope.entidades = {};
    $scope.entidadeSelecionada = {}

    var listeners = {};

    /*
    * criado por: Gustavo
    * joga a entidade desejada dentro da variavel $scope.entidadeSelecionada
    */
    $scope.selecionaEntidade = function(entidade){
        $scope.entidadeSelecionada = angular.copy(entidade);
    };

    /*
    * criado por: Osvaldo
    */
    var ready = function () {
        var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
        SIOM.emitirServer(msg);
    };

    /*
    * criado por: Osvaldo
    */
    var retallmodels = function (msg) {
        $scope.entidades = msg.getDado();
        console.log("ent", msg.getDado());
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