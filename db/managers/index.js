/**
 * Created by Osvaldo on 06/10/15.
 */

/**
 * Inicia todos os managers.
 * 
 * @type {{usuario: usuariomanager}}
 */
var Mongoosemodels = {
    usuario: require('./UsuarioManager.js')
};

module.exports = Mongoosemodels;