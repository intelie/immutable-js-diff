'use strict';

var Immutable = require('immutable');

var mapDiff = function(a, b){
  var ops = [];
  if(Immutable.is(a, b)){ return ops; }

  b.forEach(function(bValue, bKey){
    if(!a.has(bKey)){ ops.push( op('add', bKey, bValue) ); }
  });

  return ops;
};

var op = function(operation, key, value){
  return { op: operation, path: '/'+key, value: value };
};

module.exports = {
  diff: mapDiff
};