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
      function(veredict, key, value){
        var map1 = Immutable.Map().set(key, value);
        var map2 = Immutable.Map().set(key, value);

        var result = diff.diff(map1, map2);

        return veredict(result.length === 0);
      },
      [
        JSC.character('a', 'z'),
        JSC.integer(1, 100)
      ]
    );


    JSC.test(
      'returns add op when missing attribute',
      function(veredict, aKey, bKey, aValue, bValue){
        var map1 = Immutable.Map().set(aKey, aValue);
        var map2 = Immutable.Map()
          .set(aKey, aValue)
          .set(bKey, bValue);


        var result = diff.diff(map1, map2);
        var expected = {op: 'add', path: '/'+bKey, value: bValue};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.character('a', 'j'),
        JSC.character('k', 'z'),
        JSC.integer(1, 100),
        JSC.integer(101, 200)
      ]
    );

    JSC.test(
      'returns replace op when same attribute with different values',
      function(veredict, aKey, aValue, bValue){
        var map1 = Immutable.Map().set(aKey, aValue);
        var map2 = Immutable.Map().set(aKey, bValue);

        var result = diff.diff(map1, map2);
        var expected = {op: 'replace', path: '/'+aKey, value: bValue};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.character('a', 'z'),
        JSC.integer(1, 50),
        JSC.integer(51, 100)
      ]
    );

    JSC.test(
      'returns remove op when attribute is missing',
      function(veredict, aKey, aValue, bValue){
        var map1 = Immutable.Map().set(aKey, aValue);
        var map2 = Immutable.Map();

        var result = diff.diff(map1, map2);
        var expected = {op: 'remove', path: '/'+aKey};

        return veredict(
          result.length !== 0 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.character('a', 'z'),
        JSC.integer(1, 50),
        JSC.integer(51, 100)
      ]
    );

    if(failure){
      console.error(failure);
      throw failure;
    }
  });

  it('check nested structures', function(){
    var map1 = Immutable.fromJS({a: 1, b: {c: 2}});
    var map2 = Immutable.fromJS({a: 1, b: {c: 2, d: 3}});

    var result = diff.diff(map1, map2);
    var expected = {op: 'add', path: '/b/d', value: 3};

    assert.ok(result.every(function(op){ return opsAreEqual(op, expected); }));
  });
});

var opsAreEqual = function(value, expected){
  return value.op === expected.op &&
      value.path === expected.path &&
      value.value === expected.value;
};