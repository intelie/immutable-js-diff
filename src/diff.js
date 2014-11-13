'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var lcs = require('./lcs');
var path = require('./path');
var concatPath = path.concat,
                  escape = path.escape,
                  op = utils.op,
                  isMap = utils.isMap,
                  isIndexed = utils.isIndexed;

var mapDiff = function(a, b, p){
  var ops = [];
  var path = p || '';

  if(Immutable.is(a, b) || (a == b == null)){ return ops; }

  a.forEach(function(aValue, aKey){
    if(!b.has(aKey)){
      ops.push( op('remove', concatPath(path, escape(aKey))) );
    }
    else if(isMap(b.get(aKey))){
      ops = ops.concat(mapDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
    }
    else if(isIndexed(b.get(aKey)) && isIndexed(aValue)){
      ops = ops.concat(sequenceDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
    }
  });

  b.forEach(function(bValue, bKey){
    if(!a.has(bKey)){
      ops.push( op('add', concatPath(path, escape(bKey)), bValue) );
    }
    else{
      var aValue = a.get(bKey);
      var areDifferentValues = (aValue !== bValue) && !isMap(aValue) && !isIndexed(aValue);
      if(areDifferentValues) {
        ops.push(op('replace', concatPath(path, escape(bKey)), bValue));
      }
    }
  });

  return ops;
};

var sequenceDiff = function (a, b, p) {
  var ops = [];
  var path = p || '';
  if(Immutable.is(a, b) || (a == b == null)){ return ops; }

  var lcsDiff = lcs.diff(a, b);

  var pathIndex = 0;

  lcsDiff.forEach(function (diff) {
    if(diff.op === '='){ pathIndex++; }
    else if(diff.op === '!='){
      if(isMap(diff.val) && isMap(diff.newVal)){
        var mapDiffs = mapDiff(diff.val, diff.newVal, concatPath(path, pathIndex));
        ops = ops.concat(mapDiffs);
      }
      else{
        ops.push(op('replace', concatPath(path, pathIndex), diff.newVal));
      }
      pathIndex++;
    }
    else if(diff.op === '+'){
      ops.push(op('add', concatPath(path, pathIndex), diff.val));
      pathIndex++;
    }
    else if(diff.op === '-'){ ops.push(op('remove', concatPath(path, pathIndex))); }
  });

  return ops;
};

module.exports = function(a, b){
  if(a != b && (a == null || b == null)){ return Immutable.fromJS([op('replace', '/', b)]); }
  if(isIndexed(a) && isIndexed(b)){
    return Immutable.fromJS(sequenceDiff(a, b));
  }

  return Immutable.fromJS(mapDiff(a, b));
};