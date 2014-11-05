'use strict';

var Immutable = require('immutable');

var addPath = function(path, key) {
  return path + '/' + key;
};

var isMap = function(obj){ return Immutable.Iterable.isKeyed(obj); };

var mapDiff = function(a, b, p){
  var ops = [];
  var path = p || '';

  if(Immutable.is(a, b)){ return ops; }

  a.forEach(function(aValue, aKey){
    if(!b.has(aKey)){
      ops.push( op('remove', addPath(path, aKey)) );
    }
    else if(isMap(b.get(aKey))){
      ops = ops.concat(mapDiff(a.get(aKey), b.get(aKey), addPath(path, aKey)));
    }
  });

  b.forEach(function(bValue, bKey){
    var aHasBKey = a.has(bKey);
    if(!aHasBKey){
      ops.push( op('add', addPath(path, bKey), bValue) );
    }
    else if(aHasBKey && a.get(bKey) !== b.get(bKey) && !isMap(a.get(bKey))) {
      ops.push( op('replace', addPath(path, bKey), bValue) );
    }
  });

  return ops;
};

var op = function(operation, path, value){
  if(operation === 'remove') { return { op: operation, path: path }; }

  return { op: operation, path: path, value: value };
};

module.exports = {
  diff: mapDiff
};