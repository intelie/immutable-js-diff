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

  var areLists = isIndexed(a) && isIndexed(b);
  var lastKey = null;
  var removeKey = null

  if(a.forEach){
    a.forEach(function(aValue, aKey){
      if(b.has(aKey)){
        if(isMap(aValue) && isMap(b.get(aKey))){
          ops = ops.concat(mapDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
        }
        else if(isIndexed(b.get(aKey)) && isIndexed(aValue)){
          ops = ops.concat(sequenceDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
        }
        else {
          var bValue = b.get ? b.get(aKey) : b;
          var areDifferentValues = (aValue !== bValue);
          if (areDifferentValues) {
            ops.push(op('replace', concatPath(path, escape(aKey)), bValue));
          }
        }
      }
      else {
        if(areLists){
          removeKey = (lastKey != null && (lastKey+1) === aKey) ? removeKey : aKey;
          ops.push( op('remove', concatPath(path, escape(removeKey))) );
          lastKey = aKey;
        }
        else{
          ops.push( op('remove', concatPath(path, escape(aKey))) );
        }
        
      }
    });
  }

  b.forEach(function(bValue, bKey){
    if(a.has && !a.has(bKey)){
      ops.push( op('add', concatPath(path, escape(bKey)), bValue) );
    }
  });

  return ops;
};

var sequenceDiff = function (a, b, p) {
  var ops = [];
  var path = p || '';
  if(Immutable.is(a, b) || (a == b == null)){ return ops; }
  if(b.count() > 100) { return mapDiff(a, b, p); }

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

var primitiveTypeDiff = function (a, b, p) {
  var path = p || '';
  if(a === b){ return []; }
  else{
    return [ op('replace', concatPath(path, ''), b) ];
  }
};

var diff = function(a, b, p){
  if(a != b && (a == null || b == null)){ return Immutable.fromJS([op('replace', '/', b)]); }
  if(isIndexed(a) && isIndexed(b)){
    return Immutable.fromJS(sequenceDiff(a, b));
  }
  else if(isMap(a) && isMap(b)){
    return Immutable.fromJS(mapDiff(a, b));
  }
  else{
    return Immutable.fromJS(primitiveTypeDiff(a, b, p));
  }
};

module.exports = diff;