'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var appendPath = utils.appendPath,
              op = utils.op,
              isMap = utils.isMap;

var mapDiff = function(a, b, p){
  var ops = [];
  var path = p || '';

  if(Immutable.is(a, b)){ return ops; }

  a.forEach(function(aValue, aKey){
    if(!b.has(aKey)){
      ops.push( op('remove', appendPath(path, aKey)) );
    }
    else if(isMap(b.get(aKey))){
      ops = ops.concat(mapDiff(a.get(aKey), b.get(aKey), appendPath(path, aKey)));
    }
  });

  b.forEach(function(bValue, bKey){
    if(!a.has(bKey)){
      ops.push( op('add', appendPath(path, bKey), bValue) );
    }
    else{
      var aValue = a.get(bKey);
      var areDifferentValues = (aValue !== bValue) && !isMap(aValue);
      if(areDifferentValues) {
        ops.push(op('replace', appendPath(path, bKey), bValue));
      }
    }
  });

  return ops;
};

module.exports = mapDiff;