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
    },
    templateUrl: '../../../views/componentes/formularioUsuario/' +
    'formularioUsuario.html',

    link: function(scope, element, attrs) {

      var me = this;

      // -----------------VARIAVEIS DE VALIDACAO

      scope.emailErro = false;

      // ---------------------------------------


      // Variavel que guarda novo usuario
      scope.dadousuario = {
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        confirmasenha: '',
        datanascimento: new Date(),
        sexo: '',
        numerocelular: '',
        foto: '',
        tipo: 2,
        idioma: null,
      };

      me.senhahash = null;

      scope.criahash = function(senha) {
        me.senhahash = seguranca.hash(senha);
      };

      /**
       * Criado por: Gustavo
       */
      scope.salvausuario = function() {

        var dado = angular.copy(scope.dadousuario);
        dado.senha = seguranca.empacota(me.senhahash);
        dado.confirmasenha = seguranca.empacota(me.senhahash);

        // Todo OSVALDO salva esse usuario e me retorna sucesso ou erro
        // Todo OSVALDO impedir q usuario se cadastre com tipo diferente de 2
        console.log('scope.dadousuario',dado);

      };

    },
  };
}]);
