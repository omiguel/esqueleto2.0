'use strict';

module.exports = function() {
  return actor({
    extClick: function(query) {
      // Ext.ComponentQuery.query('window[text="Login"]')
      return this.executeScript(
        'Ext.ComponentQuery.query("' + query + '")[0].click()'
      );
    },
    extDblClick: function(query) {
      return this.executeScript(
        'Ext.ComponentQuery.query("' + query + '")[0].click()'
      );
    }
  });
};