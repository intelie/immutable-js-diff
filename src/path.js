'use strict';

var slashRe = new RegExp('/', 'g');
var escapedSlashRe = new RegExp('~1', 'g');
var tildeRe = /~/g;
var escapedTildeRe = /~0/g;

var Path = {
  escape: function (str) {
    if(typeof(str) === 'number'){
      return str.toString();
    }
    if(typeof(str) !== 'string'){
      throw 'param str (' + str + ') is not a string';
    }

    return str.replace(tildeRe, '~0').replace(slashRe, '~1');
  },

  unescape: function (str) {
    if(typeof(str) == 'string') {
      return str.replace(escapedSlashRe, '/').replace(escapedTildeRe, '~');
    }
    else {
      return str;
    }
  },
  concat: function(path, key){
    return path + '/' + key;
  }
};

module.exports = Path;