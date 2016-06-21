'use strict'
/**
 * Created by Osvaldo on 05/10/15.
 */

app.controller("loginController",['$scope', '$location', 'setUserLogado', '$route',function ($scope, $location, setUserLogado, $route) {
    var me = this;
    me.listeners = {};

    //----------------USADO APENAS PARA AGILIZAR LOGIN
    $scope.usuario = {
        email: "admin",
        senha: "admin"
    };
    //-----------------------------

    //-------VARIAVEIS DE VALIDACAO
    $scope.validoSenha = true;
    $scope.validoEmailCadastrado = true;
    $scope.validoServer = true;
    //-----------------------------

    me.wind = "/home";

    /**
    * criado por: Osvaldo
    * tenta logar usuario
    */
    $scope.logar = function(){
        var msg = new Mensagem(me, 'logar', $scope.usuario, 'usuario');
        SIOM.logar(msg);

    };

    /**
    * criado por: Osvaldo
    * todo comentar
    */
    me.logou = function(msg){

        setUserLogado.setLogado(msg.getDado());
        SIOM.emit('setarota', msg.getDado().tipo);

    };

    /**
    * criado por: Osvaldo
    * todo comentar
    */
    me.destroy = function () {
        for(var name in me.listeners){
            if(me.listeners.hasOwnProperty(name)){

                SIOM.removeListener(name, me.listeners[name]);

            }
        }
    };

    /**
    * criado por: Osvaldo
    * troca rota
    */
    me.nextView = function(){
        $location.path(me.wind);
        $route.reload();
    };

    /**
    * criado/modificado por: Osvaldo e Gustavo
    * retorno do server de erro do server
    */
    me.serverError = function(msg){
        $scope.validoServer = false;
        $scope.$apply();
    };

    /**
    * criado/modificado por: Osvaldo e Gustavo
    * retorno do server de email nao cadastrado
    */
    me.invalidUser = function(msg){
        $scope.validoEmailCadastrado = false;
        $scope.$apply();
    };

    /**
    * criado/modificado por: Osvaldo e Gustavo
    * retorno do server de senha incorreta
    */
    me.senhaincorreta = function (msg) {
        $scope.validoSenha = false;
        $scope.$apply();
    };

    me.wiring = function(){
        me.listeners['usuario.login'] = me.logou.bind(me);
        me.listeners['usuario.error.logar'] = me.serverError.bind(me);
        me.listeners['usuario.emailnaocadastrado'] = me.invalidUser.bind(me);
        me.listeners['usuario.senhaincorreta'] = me.senhaincorreta.bind(me);
        me.listeners['rotasetada'] = me.nextView.bind(me);

        for(var name in me.listeners){
            if(me.listeners.hasOwnProperty(name)){

                SIOM.on(name, me.listeners[name]);

            }
        }

    };

    me.wiring();

}]);