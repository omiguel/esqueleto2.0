'use strict';
/**
  * Created by Osvaldo on 06/10/15.
  */

/**
 * Inicia todos os managers.
 */
let Mongoosemodels = {
  idioma: require('./modelmanager/IdiomaManager.js'),
  usuario: require('./modelmanager/UsuarioManager.js'),
};

module.exports = Mongoosemodels;