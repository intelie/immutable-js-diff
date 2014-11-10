'use strict';

var diff = require('../src/diff');
var Immutable = require('Immutable');
var JSC = require('jscheck');
var opsAreEqual = require('./opsAreEqual');

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

  afterEach(function () {
    if(failure){
      console.error(failure);
      throw failure;
    }
  });

  it('check properties', function(){
    JSC.test(
      'returns [] when equal',
      function(veredict, obj){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj);

        var result = diff(map1, map2);

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

        var result = diff(map1, map2);
        var expected = {op: 'add', path: '/key2', value: obj2.key2};

        return veredict(
          result.length === 1 &&
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

        var result = diff(map1, map2);
        var expected = {op: 'replace', path: '/key', value: newValue};

        return veredict(
          result.length === 1 &&
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

        var result = diff(map1, map2);
        var expected = {op: 'remove', path: '/key'};

        return veredict(
          result.length === 1 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.object({
          key: JSC.integer()
        })
      ]
    );
  });

  it('check nested structures', function(){
    JSC.test(
      'returns add op when missing attribute in nested structure',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).setIn(['b', 'd'], obj2.d);

        var result = diff(map1, map2);
        var expected = {op: 'add', path: '/b/d', value: obj2.d};

        return veredict(
          result.length === 1 &&
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

    JSC.test(
      'returns replace op when different value in nested structure',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).setIn(['b', 'c'], obj2.c);

        var result = diff(map1, map2);
        var expected = {op: 'replace', path: '/b/c', value: obj2.c};

        return veredict(
          result.length === 1 &&
          result.every(function(op){ return opsAreEqual(op, expected); })
        );
      },
      [
        JSC.object({
          a: JSC.integer(),
          b: JSC.object({
            c: JSC.integer(1, 100)
          })
        }),
        JSC.object({
          c: JSC.integer(101, 200)
        })
      ]
    );

    JSC.test(
      'returns remove op when attribute removed in nested structure',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj).setIn(['b', 'd'], obj2.d);
        var map2 = Immutable.fromJS(obj);

        var result = diff(map1, map2);
        var expected = {op: 'remove', path: '/b/d'};

        return veredict(
          result.length === 1 &&
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

    JSC.test(
      'no replace in equal nested structure',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).set('a', obj2.a);

        var result = diff(map1, map2);
        var expected = {op: 'replace', path: '/a', value: obj2.a};

        return veredict(
          result.length === 1 &&
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
          a: JSC.integer()
        })
      ]
    );

    JSC.test(
      'add/remove when different nested structure',
      function(veredict, obj, obj2){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).set('b', Immutable.fromJS(obj2));

        var result = diff(map1, map2);
        var expected = [
          {op: 'remove', path: '/b/c'},
          {op: 'add', path: '/b/e', value: obj2.e},
        ];

        return veredict(
          result.length === expected.length &&
          result.every(function(op, i){ return opsAreEqual(op, expected[i]); })
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
          e: JSC.integer()
        })
      ]
    );
  });

  it('check nested indexed sequences', function () {
    JSC.test(
      'add when value added in nested sequence',
      function(veredict, obj, newInt){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).updateIn(['b', 'c'], function(list){
          return list.push(newInt);
        });

        var result = diff(map1, map2);
        var expected = [
          {op: 'add', path: '/b/c/5', value: newInt},
        ];

        return veredict(
          result.length === expected.length &&
          result.every(function(op, i){ return opsAreEqual(op, expected[i]); })
        );
      },
      [
        JSC.object({
          a: JSC.integer(),
          b: JSC.object({
            c: JSC.array(5, JSC.integer())
          })
        }),
        JSC.integer()
      ]
    );

    JSC.test(
      'remove when value removed in nested sequence',
      function(veredict, obj, removeIdx){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).updateIn(['b', 'c'], function(list){
          return list.splice(removeIdx, 1);
        });

        var result = diff(map1, map2);
        var expected = [
          {op: 'remove', path: '/b/c/'+removeIdx}
        ];

        return veredict(
          result.length === expected.length &&
          result.every(function(op, i){ return opsAreEqual(op, expected[i]); })
        );
      },
      [
        JSC.object({
          a: JSC.integer(),
          b: JSC.object({
            c: JSC.array(10, JSC.integer())
          })
        }),
        JSC.integer(0, 9)
      ]
    );

    JSC.test(
      'replace when values are replaced in nested sequence',
      function(veredict, obj, replaceIdx, newValue){
        var map1 = Immutable.fromJS(obj);
        var map2 = Immutable.fromJS(obj).updateIn(['b', 'c'], function(list){
          return list.set(replaceIdx, newValue);
        });

        var result = diff(map1, map2);
        var expected = [
          {op: 'replace', path: '/b/c/'+replaceIdx, value: newValue}
        ];

        return veredict(
          result.length === expected.length &&
          result.every(function(op, i){ return opsAreEqual(op, expected[i]); })
        );
      },
      [
        JSC.object({
          a: JSC.integer(),
          b: JSC.object({
            c: JSC.array(10, JSC.integer())
          })
        }),
        JSC.integer(0, 9),
        JSC.integer()
      ]
    );
  });
});