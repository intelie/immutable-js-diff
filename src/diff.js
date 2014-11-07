'use strict';

var mapDiff = require('./mapDiff');
var sequenceDiff = require('./sequenceDiff');
var utils = require('./utils');
var isIndexed = utils.isIndexed;

module.exports = function(a, b){
  if(isIndexed(a) && isIndexed(b)){ return sequenceDiff(a, b); }

  return mapDiff(a, b);
};