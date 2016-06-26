/**
 * Created by Osvaldo on 26/06/2016.
 */

app.factory('seguranca', ['md5', function(md5){
  var methods = {
    hash: function(value){
      return md5.createHash(value);
    },
    empacota: function (value) {
      return sjcl.codec.utf8String.toBits(value);
    }
  };

  return methods;
}]);