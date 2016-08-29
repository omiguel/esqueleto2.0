'[use strict]';
/**
 * Created by Gustavo on 27/06/2016.
 */
app.directive('formulariousuario', [
  'seguranca',
  'referencia',
  function(seguranca,
           referencia) {

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      removeref: '=',
      dadousuario: '='
    },
    templateUrl: '../../../views/componentes/formularioUsuario/' +
    'formularioUsuario.html',

    link: function(scope, element, attrs) {

      var me = this;
      var listeners = {};
      me.senhahash = null;

      //lista de dados das referencias
      scope.listareferencia = [];

      // -----------------VARIAVEIS DE VALIDACAO

      scope.primeiraTentativa = false;
      scope.emailRepetido = false;

      // ---------------------------------------

      scope.criahash = function(senha) {
        me.senhahash = seguranca.hash(senha);
      };

      /**
       * Criado/modificado por: Gustavo;
       *
       * Chega o retorno com todas as referencias;
       *
       * @param msg
       */
      me.retornoreferencia = function(msg) {
        scope.$apply(function() {
          scope.listareferencia[msg.getFlag()] = msg.getDado();
        });
        console.log('referencia', scope.listareferencia);
      };

      /**
       * Criado por: Gustavo;
       *
       * Atualiza dadousuario para idioma da navbar;
       *
       * @param msg
       */
      me.alteraidioma = function(msg) {
        //todo Gustavo transformar idioma em select
        scope.dadousuario.idioma = msg;
      };

      /**
       * Criado por: Gustavo
       */
      scope.salvausuario = function() {

        if (scope.formcadastrausuario.email.$error.required ||
            scope.formcadastrausuario.email.$invalid ||
            scope.formcadastrausuario.confirmasenha.$error.required ||
            scope.formcadastrausuario.senha.$error.required ||
            scope.dadousuario.tipo === null ||
            (scope.dadousuario.senha !== scope.dadousuario.confirmasenha)) {
              scope.primeiraTentativa = true;
        } else {

          var method = null;

          // Todo Osvaldo retornar erro quando 'scope.dadousuario.email' ja estiver cadastrado
          var dado = {
            entidade: angular.copy(scope.dadousuario),
          };
          dado.entidade.senha = seguranca.empacota(me.senhahash);
          dado.entidade.confirmasenha = seguranca.empacota(me.senhahash);

          if (dado.entidade._id) {
            method = 'update';
          } else {
            method = 'create';
          }

          var msg = new Mensagem(me, 'usuario.' + method, dado, 'usuario');
          SIOM.emitirServer(msg);
        }
      };

      var retmodelusuario = function (msg) {
        referencia.getReferencias(msg.getDado().modelo, me);
      };

      var ready = function() {
        var msg = new Mensagem(me, 'usuariomodel', {}, 'usuario');
        SIOM.emitirServer(msg);
      };

      var wiring = function() {

        listeners['usuariomodelread'] = retmodelusuario.bind(me);
        listeners['referencia.readed'] = me.retornoreferencia.bind(me);
        listeners['novoidioma'] = me.alteraidioma.bind(me);

        for (var name in listeners) {

          if (listeners.hasOwnProperty(name)) {
            SIOM.on(name, listeners[name]);
          }

        }

        ready();
      };

      wiring();

    },
  };
}]);
