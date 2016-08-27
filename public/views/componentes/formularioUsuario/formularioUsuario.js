'[use strict]';
/**
 * Created by Gustavo on 27/06/2016.
 */
app.directive('formulariousuario', [ 'seguranca', function(seguranca) {
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

      // -----------------VARIAVEIS DE VALIDACAO

      scope.emailErro = false;

      // ---------------------------------------


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

      me.senhahash = null;

      scope.criahash = function(senha) {
        me.senhahash = seguranca.hash(senha);
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

        // Todo OSVALDO fazer a opção de outro usuario cadastrar outro.
        console.log('scope.dadousuario',dado);

      };

      var pedereferencia = function () {
        var referencias = {

        };
        SIOM.emit('pedereferencias', referencias);
      };

    },
  };
}]);
