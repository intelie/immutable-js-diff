'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var appendPath = utils.appendPath,
                  op = utils.op,
                  isMap = utils.isMap;
var lcs = require('./lcs');

var sequenceDiff = function (a, b, p) {
  var path = p || '';
  if(Immutable.is(a, b)){ return []; }

  var lcsDiff = lcs.diff(a, b);

  var pathIndex = 0;
  var result = [];
  lcsDiff.forEach(function (diff, i) {
    if(diff.op === '='){ pathIndex++; }
    else if(diff.op === '+'){
      result.push(op('add', appendPath(path, pathIndex), diff.val));
      pathIndex++;
    }
    else if(diff.op === '-'){ result.push(op('remove', appendPath(path, pathIndex))); }
  });

  return result;
};



module.exports = sequenceDiff;