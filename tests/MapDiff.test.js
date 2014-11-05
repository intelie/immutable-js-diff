'use strict';

var diff = require('../src/diff');
var Immutable = require('Immutable');
var JSC = require('jscheck');
var assert = require('assert');

describe('Map diff', function(){
  var failure = null;

  before(function(){
    JSC.on_report(function(report){
      console.log(report);
    });

    JSC.on_fail(function(jsc_failure){
      failure = jsc_failure;
    });
  });

  it('check properties', function(){
    JSC.test(
      'returns [] when equal',
      function(veredict, obj){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj);

        var result = diff.diff(map1, map2);

        return veredict(result.length === 0);
      },
      [
        JSC.object(5)
      ]
    );


    JSC.test(
      'returns add op when missing attribute',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).set('key2', obj2.key2);

        var result = diff.diff(map1, map2);
        var expected = {op: 'add', path: '/key2', value: obj2.key2};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.object({
          key: JSC.integer()
        }),
        JSC.object({
          key2: JSC.integer()
        })
      ]
    );

    JSC.test(
      'returns replace op when same attribute with different values',
      function(veredict, obj, newValue){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).set('key', newValue);

        var result = diff.diff(map1, map2);
        var expected = {op: 'replace', path: '/key', value: newValue};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.object({
          key: JSC.integer(1, 100)
        }),
        JSC.integer(101, 200)
      ]
    );

    JSC.test(
      'returns remove op when attribute is missing',
      function(veredict, obj){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.Map();

        var result = diff.diff(map1, map2);
        var expected = {op: 'remove', path: '/key'};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.object({
          key: JSC.integer()
        })
      ]
    );

    if(failure){
      console.error(failure);
      throw failure;
    }
  });

  it('check nested structures', function(){
    JSC.test(
      'returns add op when missing attribute in nested structure',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).setIn(['b', 'd'], obj2.d);

        var result = diff.diff(map1, map2);
        var expected = {op: 'add', path: '/b/d', value: obj2.d};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.object({
          a: JSC.integer(),
          b: JSC.object({
            c: JSC.integer()
          })
        }),
        JSC.object({
          d: JSC.integer()
        })
      ]
    );
  });
});

var opsAreEqual = function(value, expected){
  return value.op === expected.op &&
      value.path === expected.path &&
      value.value === expected.value;
};