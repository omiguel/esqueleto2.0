/**
 * Created by Osvaldo on 13/06/2016.
 */
var ctrbd = require('../../util/ctrbd.js');
var Mongoose = require('../Banco.js').mongoose;

var types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
    nome: {type: types.String}
});

new ctrbd('idioma', obj);

module.exports = Mongoose.model('idioma', obj);
