'use strict';

var diff = require('../src/diff');
var Immutable = require('Immutable');
var JSC = require('jscheck');
var assert = require('assert');
var opsAreEqual = require('./opsAreEqual');

describe('Sequence diff', function() {
  var failure = null;

  before(function () {
    JSC.on_report(function (report) {
      console.log(report);
    });

    JSC.on_fail(function (jsc_failure) {
      failure = jsc_failure;
    });
  });

  afterEach(function () {
    if(failure){
      console.error(failure);
      throw failure;
    }
  });

  it('check properties', function () {
    JSC.test(
      'returns [] when equal',
      function(veredict, array){
        var list1 = Immutable.fromJS(array);
        var list2 = Immutable.fromJS(array);

        var result = diff(list1, list2);

        return veredict(result.length === 0);
      },
      [
        JSC.array(5, JSC.integer())
      ]
    );
  });

  it('returns add operation', function () {
    var list1 = Immutable.fromJS([1,2,3,4]);
    var list2 = Immutable.fromJS([1,2,3,4,5]);

    var result = diff(list1, list2);
    var expected = [{op: 'add', path: '/4', value: 5}];

    assert.ok(result.every(function(op, i){ return opsAreEqual(op, expected[i]); }));
  });

  it('returns remove operation', function () {
    var list1 = Immutable.fromJS([1,2,3,4]);
    var list2 = Immutable.fromJS([1,2,4]);

    var result = diff(list1, list2);
    var expected = [{op: 'remove', path: '/2'}];

    assert.ok(result.every(function(op, i){ return opsAreEqual(op, expected[i]); }));
  });

  it('returns add/remove operations', function () {
    var list1 = Immutable.fromJS([1,2,3,4]);
    var list2 = Immutable.fromJS([1,2,4,5]);

    var result = diff(list1, list2);
    var expected = [
      {op: 'replace', path: '/2', value: 4},
      {op: 'replace', path: '/3', value: 5}];

    assert.ok(result.every(function(op, i){ return opsAreEqual(op, expected[i]); }));
  });

  it('JSCheck', function () {
    JSC.test(
      'returns add when value is inserted in the middle of sequence',
      function(veredict, array, addIdx, newValue){
        var list1 = Immutable.fromJS(array);
        var list2 = Immutable.fromJS(array);
        var modifiedList = list2.splice(addIdx, 0, newValue);

        var result = diff(list1, modifiedList);
        var expected = [
          {op: 'add', path: '/'+addIdx, value: newValue}
        ];

        return veredict(result.every(function(op, i){ return opsAreEqual(op, expected[i]); }));
      },
      [
        JSC.array(10, JSC.integer()),
        JSC.integer(0, 9),
        JSC.integer()
      ]
    );

    JSC.test(
      'returns remove',
      function(veredict, array, removeIdx, newValue){
        var list1 = Immutable.fromJS(array);
        var list2 = Immutable.fromJS(array);
        var modifiedList = list2.splice(removeIdx, 1);

        var result = diff(list1, modifiedList);
        var expected = [
          {op: 'remove', path: '/'+removeIdx}
        ];

        return veredict(result.every(function(op, i){ return opsAreEqual(op, expected[i]); }));
      },
      [
        JSC.array(10, JSC.integer()),
        JSC.integer(0, 9)
      ]
    );

    JSC.test(
      'returns replace operations',
      function(veredict, array, replaceIdx, newValue){
        var list1 = Immutable.fromJS(array);
        var list2 = Immutable.fromJS(array);
        var modifiedList = list2.set(replaceIdx, newValue);

        var result = diff(list1, modifiedList);
        var expected = [
          {op: 'replace', path: '/'+replaceIdx, value: newValue}
        ];

        return veredict(result.every(function(op, i){ return opsAreEqual(op, expected[i]); }));
      },
      [
        JSC.array(10, JSC.integer()),
        JSC.integer(0, 9),
        JSC.integer()
      ]
    );
  });
});