'[use strict]';
/**
 * Created by Gustavo on 27/06/2016.
 */
app.directive('formulariousuario', [ 'seguranca', function(seguranca) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
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
        tipo: null,
        idioma: null,
      };

      // Senha codificada
      me.senhaHash = null;

      scope.criaHash = function(senha) {
        me.senhaHash = seguranca.hash(senha);
      };

      /**
       * Criado por: Gustavo
       */
      scope.salvaUsuario = function() {

        scope.dadousuario.senha = seguranca.cifra(me.senhaHash);

        // Todo OSVALDO salva esse usuario e me retorna sucesso ou erro
        console.log('scope.dadousuario',scope.dadousuario);

      };

    },
  };
}]);
