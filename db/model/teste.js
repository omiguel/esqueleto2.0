'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 */
const Ctrbd = require('../../util/ctrbd.js');
const Mongoose = require('../Banco.js').mongoose;

const types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
  usuario: {type: types.ObjectId, ref: 'usuario'},
  idioma: {type: types.ObjectId, ref: 'idioma'},
  endereco: {type: types.String},
});

let ctrbd = new Ctrbd('teste', obj);

module.exports = Mongoose.model('teste', obj);