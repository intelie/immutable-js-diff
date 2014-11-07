'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var appendPath = utils.appendPath,
              op = utils.op,
              isMap = utils.isMap,
              isIndexed = utils.isIndexed;
var sequenceDiff = require('./sequenceDiff');

var mapDiff = function(a, b, p){
  var ops = [];
  var path = p || '';

  if(Immutable.is(a, b)){ return ops; }

  a.forEach(function(aValue, aKey){
    if(!b.has(aKey)){
      ops.push( op('remove', appendPath(path, aKey)) );
    }
    else if(isMap(b.get(aKey))){
      ops = ops.concat(mapDiff(aValue, b.get(aKey), appendPath(path, aKey)));
    }
    else if(isIndexed(b.get(aKey)) && isIndexed(aValue)){
      ops = ops.concat(sequenceDiff(aValue, b.get(aKey), appendPath(path, aKey)));
    }
  });

  b.forEach(function(bValue, bKey){
    if(!a.has(bKey)){
      ops.push( op('add', appendPath(path, bKey), bValue) );
    }
    else{
      var aValue = a.get(bKey);
      var areDifferentValues = (aValue !== bValue) && !isMap(aValue) && !isIndexed(aValue);
      if(areDifferentValues) {
        ops.push(op('replace', appendPath(path, bKey), bValue));
      }
    }
  });

  return ops;
};

module.exports = mapDiff;