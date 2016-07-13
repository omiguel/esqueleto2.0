'[use strict]';
/**
 * Created by Gustavo on 11/07/2016.
 */

// TAG:
// <polymer-tag-exemplo param1="1" param2="2"></polymer-tag-exemplo>

var me = this;

me.funcJS = function() {
  console.log('foi chamado, funcJS');
};

Polymer({
  is: 'polymer-tag-exemplo',

  properties: {

    listeners: [],

    param1: '',
    param2: '',

    imprimeparam: {
      type: String,
      computed: 'funcPolymer1(param1, param2)',
    },

  },

  funcPolymer1: function(p1, p2) {

    me.funcJS();
    this.funcPolymer2();
    this.wiring();

    return p1 + ' ' + p2;
  },

  funcPolymer2: function() {
    console.log('foi chamado, funcPolymer2');
  },

  wiring: function() {

    this.listeners['nome_evento'] = me.funcJS.bind(me);
    this.listeners['nome_evento'] = this.funcPolymer2.bind(me);

    for (var name in this.listeners) {
      if (this.listeners.hasOwnProperty(name)) {

        SIOM.on(name, this.listeners[name]);

      }
    }
  },

});