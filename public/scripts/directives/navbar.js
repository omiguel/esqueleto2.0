/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive("navbar", ['$location', 'getUserLogado', 'setUserLogado', '$window', function($location, getUserLogado, setUserLogado, $window) {
    return {
        restrict : 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/navbar.html',

        link: function(scope, element){

            console.log("element", element);

            //todo deve receber getUserLogado.getLogado() atraves de msg
            scope.usuariologado = null;

            /*
            * criado por: Gustavo
            * desloga usuario
             */
            scope.sair = function(local){

                setUserLogado.setLogado(null);
                scope.usuariologado = null;

                var wind = "/"+local;
                $location.path(wind);

            };

            /*
            * criado por: Gustavo
            * troca de tela
             */
            scope.navega = function (local) {

                var wind = "/"+local;
                $location.path(wind);

            };
        }
    };
}]);
