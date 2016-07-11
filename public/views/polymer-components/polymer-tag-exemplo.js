'[use strict]';
/**
 * Created by Gustavo on 11/07/2016.
 */

// TAG:
// <polymer-tag-exemplo titulo1="1" titulo2="2"></polymer-tag-exemplo>

var me = this;

me.funcNormalJS = function() {
  console.log('estou aqui!');
};

Polymer({
  is: 'polymer-tag-exemplo',

  properties: {
    titulo1: String,
    titulo2: String,
    todosTitulos: {
      type: String,
      computed: 'funcPolymer(titulo1, titulo2)',
    },
  },

  funcPolymer: function(param1, param2) {
    me.funcNormalJS();
    return param1 + ' ' + param2;
  },

});