'[use strict]';
/**
 * Created by Gustavo on 21/05/2016.
 */
app.controller('entidadesController', [
  '$scope',
  function($scope) {

  var me = this;

  // Guarda todas as entidades do banco
  $scope.entidades = {};
  // Guarda a entidade selecionada assim como a nova criada
  $scope.entidadeSelecionada = {};
  // Guarda a lista de entidades criada
  $scope.listaEntidade = [];
  // Guarda o nome do modal de retorno
  $scope.modalTitulo = null;
  // Guarda o texto do modal de retorno
  $scope.modalTexto = null;


  var listeners = {};

  /**
   * Criado/modificado por: Gustavo e Osvaldo;
   * Joga a entidade desejada dentro da variavel $scope.entidadeSelecionada;
   * Cria e popula objeto dadoentidade da variavel $scope.entidadeSelecionada;
   * Transforma o Date que vem do banco em tipo Date;
   */
  $scope.selecionaEntidade =
    function(entidadeNome, entidadeModelo, dadoEntidade, modal) {

    dadoEntidade.confirmasenha = dadoEntidade.senha;

    for (var index in entidadeModelo) {
      if (entidadeModelo.hasOwnProperty(index)) {

        if (dadoEntidade[index] === undefined) {
          dadoEntidade[index] = null;
        }

        if (entidadeModelo[index] === 'Date') {
          dadoEntidade[index] = new Date(dadoEntidade[index]);
        }

      }
    }

    $scope.entidadeSelecionada = {
      nome: entidadeNome,
      modelo: entidadeModelo,
      dadoentidade: dadoEntidade,
    };

    if (modal === 'modalMostraEntidade') {
      SIOM.emit('pedereferencias', $scope.entidadeSelecionada);
    } else {
      $('#' + modal).modal();
    }

  };

  /**
   * Criado por: Osvaldo e Gustavo;
   * Chama a lista da entidade selecionada para visualização;
   */
  $scope.visualidasCadastradosEntidade = function(entidade) {

    $scope.listaEntidade = {
      nome: entidade.nome,
      modelo: entidade.modelo,
      lista: [],
    };

    var dado = {
      nome: entidade.nome,
    };
    var msg = new Mensagem(me, 'entidade.read', dado, 'entidade');
    SIOM.emitirServer(msg);
  };

  /**
   * Criado por: Osvaldo;
   * Funcao padrao pra todos os controllers, essa funcao faz os pedidos de tudo
   * Que precisa para que o controller;
   * Inicie sua view;
   */
  var ready = function() {
    var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
    SIOM.emitirServer(msg);
  };

  /**
   * Criado por: Osvaldo;
   * Essa funcao retorna todos os models criados no banco;
   */
  var retallmodels = function(msg) {
    $scope.entidades = msg.getDado();
    $scope.$apply();
  };

  /**
   * Criado/modificado por: Gustavo e Bosvaldo;
   * Retorna na interface que entidade foi criada;
   */
  var retEntidadeCriada = function(msg) {

    $scope.modalTitulo = $scope.entidadeSelecionada.nome + ' criado!';
    $scope.modalTexto = $scope.entidadeSelecionada.nome + ' criado com sucesso!';

    $('#modalRetorno').modal();
    $('#modalCriaEntidade').modal('toggle');

    $scope.$apply();

  };

  /**
   * Criado/modificado por: Gustavo e Osvaldo;
   * Retorna na interface que entidade foi deletada;
   */
  var retEntidadeDeletede = function(msg) {

    $scope.modalTitulo = 'deleta ' + $scope.entidadeSelecionada.nome;
    $scope.modalTexto = $scope.entidadeSelecionada.nome + ' deletado com sucesso!';

    $('#modalRetorno').modal();

    $scope.$apply();

  };

  /**
   * Criado/modificado por: Gustavo e Osvaldo;
   * Retorna na interface que entidade foi atualizada;
   */
  var retEntidadeUpdated = function(msg) {

    $scope.modalTitulo = 'atualiza ' + $scope.entidadeSelecionada.nome;
    $scope.modalTexto = $scope.entidadeSelecionada.nome + ' atualizado com sucesso!';

    $('#modalRetorno').modal();
    $('#modalCriaEntidade').modal('toggle');

    $scope.$apply();

  };

  /**
   * Criado/modificado por: Gustavo e Bosvaldo;
   * Retorno do banco com a lista de elementos da entidade requisitada;
   */
  var retEntidadeReaded = function(msg) {

    $scope.listaEntidade.lista = angular.copy(msg.getDado());

    //todo OSVALDO remover depois, apenas usado para tirar __v
    for (var index in $scope.listaEntidade.lista) {
      for (var procuraV in $scope.listaEntidade.lista[index]) {
        if (procuraV === "__v") {
          delete $scope.listaEntidade.lista[index][procuraV];
        }
      }
    }

    $scope.$apply();

    $('#modalMostraEntidade').modal();

  };

  var wiring = function() {

    listeners['allmodels'] = retallmodels.bind(me);
    listeners['entidade.created'] = retEntidadeCriada.bind(me);
    listeners['entidade.readed'] = retEntidadeReaded.bind(me);
    listeners['entidade.destroied'] = retEntidadeDeletede.bind(me);
    listeners['entidade.updated'] = retEntidadeUpdated.bind(me);

    for (var name in listeners) {
      if (listeners.hasOwnProperty(name)) {

        SIOM.on(name, listeners[name]);

      }
    }

    ready();
  };

  wiring();

}]);