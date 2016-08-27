'[use strict]';
/**
 * Created by Gustavo on 27/08/2016.
 */

app.factory('referencia', [function() {
  var method = {

    /**
     * Responsavel por solicitar a referencia da entidade passada por parametro.
     * precisa do this para poder jogar dentro da msg qual documento esta
     * precisando da referencia.
     *
     * @param dado
     * @param me
     * @param cb
     */
    getReferencias: function(dado, me, cb) {

      var minhasrefs = [];
      for (var attr in dado.modelo) {
        if (typeof dado.modelo[attr] === 'object') {
          minhasrefs.push(dado.modelo[attr]);
        }
      }
      if (minhasrefs.length > 0) {

        var msg = new Mensagem(
          me,
          'referencia.read',
          minhasrefs,
          'referencia'
        );

        SIOM.emitirServer(msg);
      }

      cb();

    },
  };

  return method;
}]);