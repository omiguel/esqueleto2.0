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
      scope.listareferencia = [];

      me.senhahash = null;
      // Variavel que guarda novo usuario
      // scope.dadousuario = {
      //   nome: '',
      //   sobrenome: '',
      //   email: '',
      //   senha: '',
      //   confirmasenha: '',
      //   datanascimento: null,
      //   sexo: '',
      //   numerocelular: '',
      //   foto: '',
      //   tipo: 2,
      //   idioma: null,
      // };

      // -----------------VARIAVEIS DE VALIDACAO

      scope.emailErro = false;

      // ---------------------------------------

      /**
       * todo Gustavo quando usuario passar mouse em cima do btn de cadastrar
       * usuario mudar a cor de todos os inputs obrigatorios(vermelho=errado,
       * verdo=correto). usando class 'form-'+nomeinput
       */
      // $('.formuser-btn').mouseover(function () {
      //   var inputsobrigatorios = ['email', 'senha', 'confirmasenha', 'tipo'];
      //
      //   for(var indexinput in inputsobrigatorios) {
      //     if (inputsobrigatorios.hasOwnProperty(indexinput)) {
      //       console.log('indexinput', indexinput);
      //     }
      //   }
      //
      // });

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
      var retornoreferencia = function(msg) {
        scope.$apply(function() {
          scope.listareferencia[msg.getFlag()] = msg.getDado();
        });
        console.log('referencia', scope.listareferencia);
      };

      /**
       * Criado por: Gustavo
       */
      scope.salvausuario = function() {

        var method = null;

        // Todo, Gustavo, tens que me mandar aqui o idioma que ele esta usando.
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
        listeners['referencia.readed'] = retornoreferencia.bind(me);

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
