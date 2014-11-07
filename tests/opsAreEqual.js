'use strict';

module.exports = function(value, expected){
  return value.op === expected.op &&
    value.path === expected.path &&
    value.value === expected.value;
};