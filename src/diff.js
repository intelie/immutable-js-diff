'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var lcs = require('./lcs');
var appendPath = utils.appendPath,
                  op = utils.op,
                  isMap = utils.isMap,
                  isIndexed = utils.isIndexed;

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

var sequenceDiff = function (a, b, p) {
  var path = p || '';
  if(Immutable.is(a, b)){ return []; }

  var lcsDiff = lcs.diff(a, b);

  var pathIndex = 0;
  var result = [];
  lcsDiff.forEach(function (diff, i) {
    if(diff.op === '='){ pathIndex++; }
    else if(diff.op === '!='){
      if(isMap(diff.val) && isMap(diff.newVal)){
        var mapDiffs = mapDiff(diff.val, diff.newVal, appendPath(path, pathIndex));
        result = result.concat(mapDiffs);
      }
      else{
        result.push(op('replace', appendPath(path, pathIndex), diff.newVal));
      }
      pathIndex++;
    }
    else if(diff.op === '+'){
      result.push(op('add', appendPath(path, pathIndex), diff.val));
      pathIndex++;
    }
    else if(diff.op === '-'){ result.push(op('remove', appendPath(path, pathIndex))); }
  });

  return result;
};

module.exports = function(a, b){
  if(isIndexed(a) && isIndexed(b)){
    return Immutable.fromJS(sequenceDiff(a, b));
  }

  return Immutable.fromJS(mapDiff(a, b));
};