'use strict';
/**
 * Created by Osvaldo on 13/03/15.
 */
const hub = require('../hub/hub.js');

class dbIndex {
  constructor(dbconfig) {
    this.managers = null;

    /**
     * Se escutar 'banco.status.ready' no hub, carrega os managers que seraão
     * usados
     * e da um emit informando que o banco está
     * pronto.
     */
    hub.on('banco.status.ready', function() {
      console.log('vou chamar os managers');

      this.managers = require('./managers/');

      process.nextTick(function() {
        console.log('banco finalizado');
        hub.emit('banco.ready');
      });
    });

    let banco = require('./Banco.js');
    banco.init(dbconfig);
  }
}

module.exports = dbIndex;