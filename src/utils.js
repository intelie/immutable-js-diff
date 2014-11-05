'use strict';

var Immutable = require('immutable');

var appendPath = function(path, key) {
  return path + '/' + key;
};

var isMap = function(obj){ return Immutable.Iterable.isKeyed(obj); };

var op = function(operation, path, value){
  if(operation === 'remove') { return { op: operation, path: path }; }

  return { op: operation, path: path, value: value };
};

module.exports = {
  appendPath: appendPath,
  isMap: isMap,
  op: op
};