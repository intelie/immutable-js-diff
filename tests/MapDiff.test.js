'use strict';

var diff = require('../src/diff');
var Immutable = require('Immutable');
var JSC = require('jscheck');

describe('Map diff', function(){
  before(function(){
    JSC.on_report(function(report){
      console.log(report);
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
        JSC.character('a', 'z'),
        JSC.character('a', 'z'),
        JSC.integer(1, 100),
        JSC.integer(1, 100)
      ],
      function(aKey, bKey, aValue, bValue){
        return aKey !== bKey && aValue !== bValue ? 'ok' : false;
      }
    );

    JSC.test(
      'returns replace op when same attribute with different values',
      function(veredict, aKey, aValue, bValue){
        var map1 = Immutable.Map().set(aKey, aValue);
        var map2 = Immutable.Map().set(aKey, bValue)

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
  });
});

var opsAreEqual = function(value, expected){
  return value.op === expected.op &&
      value.path === expected.path &&
      value.value === expected.value;
};