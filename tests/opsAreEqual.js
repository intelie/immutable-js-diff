'use strict';

var assert = require('assert');
var utils = require('../src/utils');
var isMap = utils.isMap,
            isIndexed = utils.isIndexed;

var toJS = function(maybeImmutable){
  if(isMap(maybeImmutable) || isIndexed(maybeImmutable)){
    return maybeImmutable.toJS();
  }
  else{
    return maybeImmutable;
  }
};

module.exports = function(value, expected){
  assert.strictEqual(value.op, expected.op);
  assert.strictEqual(value.path, expected.path);
  assert.deepEqual(toJS(value.value), toJS(expected.value))

  return true;
};