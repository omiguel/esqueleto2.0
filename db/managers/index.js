/**
 * Created by Osvaldo on 06/10/15.
 */

/**
 * Inicia todos os managers.
 *
 * @type {{usuario: usuariomanager}}
 */
var Mongoosemodels = {
    idioma: require('./IdiomaManager.js'),
    usuario: require('./UsuarioManager.js'),
    teste: require('./testemanager.js')
};

module.exports = Mongoosemodels;