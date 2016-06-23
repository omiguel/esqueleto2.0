'use strict';
/**
 * Created by Osvaldo on 23/06/2016.
 */

const util = require('util');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const config = require('../config.json').eventConfig;

class Hub extends EventEmitter2{
  constructor(me, eventConfig) {
    super(me, eventConfig);
  }
}

module.exports = new Hub(this, config);