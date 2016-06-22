'use strict';
/**
 * Created by Osvaldo on 13/06/2016.
 */
const Ctrbd = require('../../util/ctrbd.js');
const Mongoose = require('../Banco.js').mongoose;

const types = Mongoose.Schema.Types;

let obj = Mongoose.Schema({
  nome: {type: types.String},
});

let ctrbd = new Ctrbd('idioma', obj, 'nome');

module.exports = Mongoose.model('idioma', obj);
