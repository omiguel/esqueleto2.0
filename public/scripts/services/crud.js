/**
 * Created by Osvaldo Miguel Junior on 03/06/2016.
 */

app.factory('crudfactory', [function () {

    crud = function (metodo, entidade, dado, source) {

        var evento = metodo+'.'+entidade;
        var msgcrud = new Mensagem(source, evento, dado, entidade);
        console.log('chegou aqui', msgcrud);
        return;

        SIOM.emitirServer(msgcrud);

    };

    return 0;
}]);

