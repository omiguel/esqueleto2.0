'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 */
const Ctrbd = require('../../util/ctrbd.js');
const Mongoose = require('../Banco.js').mongoose;

const types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
  nome: {type: types.String},
  sobrenome: {type: types.String},
  email: {type: types.String, required: true, index: {unique: true}},
  senha: {type: types.String, required: true},
  datanascimento: {type: types.Date},
  sexo: {type: types.String},
  numerocelular: {type: types.String},
  foto: {type: types.String},
  tipo: {type: types.Number, required: true},
  idioma: {type: types.ObjectId, ref: 'idioma'},
});

let ctrbd = new Ctrbd('usuario', obj, 'nome');

module.exports = Mongoose.model('usuario', obj);