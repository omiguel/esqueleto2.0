/**
 * Created by udesc on 21/05/2016.
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

            var limpanav = function (ponde, cb) {
                for(var id in scope.classes){
                    utilvalues.rotaatual[id] = '';
                }
                cb();
            };

            scope.navega = function (ponde) {

                console.log("pq n imprime");
                console.log("getUserLogado", getUserLogado.getLogado());

                limpanav(ponde, function () {
                    utilvalues.rotaatual[ponde] = 'active';
                    $location.path('/'+ponde);
                });
            }

            //todo
            //var wind = "/";
            //$location.path(wind);
            //
            //// para ser compativel com firefox
            //$window.location.href = wind;
            //$window.location.reload();
        }
    };
}]);
