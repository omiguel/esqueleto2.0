/**
 * Created by Osvaldo/Gustavo on 22/10/15.
 */

function ConfigRotas($routeProvider) {
  var me = this;
  me.route = $routeProvider;
  me.listeners = {};

  me.rotas = {};

  me.incluiRota = function(){
    me.rotas['/home'] = {templateUrl: '../views/home/home.html', controller: 'homeController'};
    me.rotas['/entidades'] = {templateUrl: '../views/entidades/entidades.html', controller: 'entidadesController'};

    me.ligaRota();

  };

  me.ligaRota = function () {
    for(var name in me.rotas){
      me.route.when(name, me.rotas[name]);
    }
  };

  me.setaRota = function(tipoUser){

    if(tipoUser != undefined){
      me.incluiRota();
    }

    for(var name in me.rotas){
      me.route.when(name, me.rotas[name]);
    }

    SIOM.emit('rotasetada');
  };

  me.usuariosaiu = function () {
    me.destroy();
  };

  me.destroy = function () {
    for(var name in me.listeners){
      SIOM.removeListener(name, me.listeners[name]);
    }
  };

  me.wiring = function(){

    me.route.when('/', {templateUrl: '../views/login/login.html', controller: 'loginController'});

    me.listeners['setarota'] = me.setaRota.bind(me);
    me.listeners['exit'] = me.usuariosaiu.bind(me);

    for(var name in me.listeners){
      SIOM.on(name, me.listeners[name]);
    }

  };

  me.wiring();
}

app.config(ConfigRotas);