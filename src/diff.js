'use strict';

var Immutable = require('immutable');

var mapDiff = function(map1, map2){
  if(Immutable.is(map1, map2)){return [];}
};

module.exports = {
  diff: mapDiff
};