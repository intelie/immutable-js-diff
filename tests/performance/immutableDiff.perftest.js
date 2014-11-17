'use strict';

var Immutable = require('immutable');
var veryBigArray = require('./veryBigArray');
var immutableDiff = require('../../src/diff');
var jsondiff = require('jsondiff');

var immutableDiffPerformanceTest = function(){
  var list1 = Immutable.fromJS(veryBigArray);
  var list2 = list1.concat({x: 10, y: 7000});

  var diff = immutableDiff(list1, list2);

  console.log(diff);
};

var jsondiffPerformanceTest = function(){
  var list1 = veryBigArray;
  var list2 = list1.concat({x: 10, y: 7000});

  var diff = jsondiff.diff(list1, list2);

  console.log(diff);
};

immutableDiffPerformanceTest();