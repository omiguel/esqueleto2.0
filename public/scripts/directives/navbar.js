/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive("navbar", ['$location', 'utilvalues', 'getUserLogado', function($location, utilvalues, getUserLogado) {
    return {
        restrict : 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/navbar.html',

        link: function(scope, element){

            console.log("getUserLogado", getUserLogado);

            scope.classes = utilvalues.rotaatual;

            //var limpanav = function (ponde, cb) {
            //    for(var id in scope.classes){
            //        utilvalues.rotaatual[id] = '';
            //    }
            //    cb();
            //};

            scope.sair = function(local){
                //todo precisa deslogar usuario
                scope.navega(local);
            };

            scope.navega = function (local) {

                console.log("pq n imprime");
                console.log("getUserLogado", getUserLogado.getLogado());

                var wind = "/"+local;
                $location.path(wind);

                // para ser compativel com firefox
                $window.location.href = wind;
                $window.location.reload();

            };
        }
    };
}]);
