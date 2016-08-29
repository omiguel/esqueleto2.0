'[use strict]';
/**
 * Created by Gustavo on 21/05/2016.
 */
app.controller('entidadesController', [
  '$scope',
  function($scope) {

  var me = this;
  var listeners = {};

  // --------------------VARIAVEIS MODAL RETORNO
  // Guarda o nome do modal de retorno
  $scope.modalTitulo = '';
  // Guarda o texto do modal de retorno
  $scope.modalTexto = '';
  // Guarda o id do modal para retornar
  $scope.modalParaRetornar = '';
  // Guarda o nome da funcao q deve executar depois do modal de retorno
  $scope.modalFuncaoRetorno = '';
  // -------------------------------------------

  // Guarda todas as entidades do banco
  $scope.entidades = {};
  // Guarda a entidade selecionada assim como a nova criada
  $scope.entidadeSelecionada = {};
  // Guarda a lista de entidades criada
  $scope.listaEntidade = [];

  /**
   * Criado/modificado por: Gustavo e Osvaldo;
   *
   * Joga a entidade desejada dentro da variavel $scope.entidadeSelecionada;
   * Cria e popula objeto dadoentidade da variavel $scope.entidadeSelecionada;
   * Transforma o Date que vem do banco em tipo Date;
   *
   * @param entidadeNome
   * @param entidadeModelo
   * @param dadoEntidade
   * @param modal
   */
  $scope.selecionaEntidade = function(entidadeNome,
                                      entidadeModelo,
                                      dadoEntidade,
                                      modal) {

    // Popula dadoEntidade
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

    // Ref desnecessario em dadoEntidade
    delete dadoEntidade.ref;

    // Polula $scope.entidadeSelecionada
    $scope.entidadeSelecionada = {
      nome: entidadeNome,
      modelo: entidadeModelo,
      dadoentidade: dadoEntidade,
    };

    // Decide o que fazer dependendo do modal
    if (modal === 'modalCriaEntidade') {
      $scope.entidadeSelecionada.dadoentidade.senha = null;
      SIOM.emit('pedereferencias', $scope.entidadeSelecionada);
    } else {
      $('#' + modal).modal();
    }

  };

  /**
   * Criado por: Osvaldo e Gustavo;
   *
   * Chama a lista da entidade selecionada para visualização;
   *
   * @param entidade
   */
  $scope.visualizaCadastroEntidades = function(entidade) {

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
   *
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
   *
   * Essa funcao retorna todos os models criados no banco;
   *
   * @param msg
   */
  var retallmodels = function(msg) {
    $scope.entidades = msg.getDado();
    $scope.$apply();
  };

  /**
   * Criado/modificado por: Gustavo e Bosvaldo;
   *
   * Retorna na interface que entidade foi criada;
   *
   * @param msg
   */
  var retEntidadeCriada = function(msg) {

    $scope.modalTitulo = $scope.entidadeSelecionada.nome + ' criado!';
    $scope.modalTexto = $scope.entidadeSelecionada.nome + ' criado com ' +
      'sucesso!';
    $scope.modalParaRetornar = 'modalCriaEntidade';
    $scope.modalFuncaoRetorno = '';

    $('#modalRetorno').modal();
    $('#modalCriaEntidade').modal('toggle');

    $scope.$apply();

  };

  /**
   * Criado/modificado por: Gustavo e Osvaldo;
   *
   * Retorna na interface que entidade foi deletada;
   * Pede no banco nova lista de entidade;
   *
   * @param msg
   */
  var retEntidadeDeletede = function(msg) {

    $scope.modalTitulo = 'deleta ' + $scope.entidadeSelecionada.nome;
    $scope.modalTexto = $scope.entidadeSelecionada.nome + ' deletado com ' +
      'sucesso!';
    $scope.modalParaRetornar = 'modalMostraEntidade';
    $scope.modalFuncaoRetorno = 'visualizaCadastroEntidades';

    $('#modalRetorno').modal();

    $scope.$apply();

  };

  /**
   * Criado/modificado por: Gustavo e Osvaldo;
   *
   * Retorna na interface que entidade foi atualizada;
   *
   * @param msg
   */
  var retEntidadeUpdated = function(msg) {

    $scope.modalTitulo = 'atualiza ' + $scope.entidadeSelecionada.nome;
    $scope.modalTexto = $scope.entidadeSelecionada.nome + ' atualizado com ' +
      'sucesso!';
    $scope.modalParaRetornar = 'modalMostraEntidade';
    $scope.modalFuncaoRetorno = '';

    $('#modalRetorno').modal();
    $('#modalCriaEntidade').modal('toggle');

    $scope.$apply();

  };

  /**
   * Criado/modificado por: Gustavo e Bosvaldo;
   *
   * Retorno do banco com a lista de elementos da entidade requisitada;
   *
   * @param msg
   */
  var retEntidadeReaded = function(msg) {

    $scope.listaEntidade.lista = angular.copy(msg.getDado());

    $('#modalMostraEntidade').modal();
    
    $scope.$apply();

  };

  /**
   * Criado por Gustavo;
   *
   * Executa funcao de retorno;
   */
  $scope.executaFuncaoRetorno = function() {
    // TODO melhorar
    $scope[$scope.modalFuncaoRetorno]($scope.entidadeSelecionada);

  };

  var wiring = function() {

    listeners['allmodels'] = retallmodels.bind(me);
    listeners['entidade.created'] = retEntidadeCriada.bind(me);
    listeners['usuario.created'] = retEntidadeCriada.bind(me);
    listeners['entidade.readed'] = retEntidadeReaded.bind(me);
    listeners['entidade.destroied'] = retEntidadeDeletede.bind(me);
    listeners['entidade.updated'] = retEntidadeUpdated.bind(me);
    listeners['usuario.updated'] = retEntidadeUpdated.bind(me);

    for (var name in listeners) {
      if (listeners.hasOwnProperty(name)) {

        SIOM.on(name, listeners[name]);

      }
    }

    ready();
  };

  wiring();

}]);