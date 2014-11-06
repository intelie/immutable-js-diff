'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var appendPath = utils.appendPath,
                  op = utils.op,
                  isMap = utils.isMap;
var lcs = require('./lcs');

var sequenceDiff = function (a, b, p) {
  if(Immutable.is(a, b)){ return []; }
};



module.exports = sequenceDiff;