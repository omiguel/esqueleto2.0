/**
 * Created by Osvaldo on 06/10/15.
 */
var ctrbd = require('../../util/ctrbd.js');
var Mongoose = require('../Banco.js').mongoose;

var types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
    usuario: {type: types.ObjectId, ref: 'usuario'},
    idioma: {type: types.ObjectId, ref: 'idioma'}
});

new ctrbd('teste', obj);

module.exports = Mongoose.model('teste', obj);