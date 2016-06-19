/**
 * Created by Osvaldo on 06/10/15.
 */

/**
 * Inicia todos os managers.
 *
 * @type {{usuario: usuariomanager}}
 */
var Mongoosemodels = {
    idioma: require('./modelmanager/IdiomaManager.js'),
    usuario: require('./modelmanager/UsuarioManager.js'),
    teste: require('./modelmanager/testemanager.js')
};

module.exports = Mongoosemodels;