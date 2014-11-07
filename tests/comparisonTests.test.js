'use strict';

var Immutable = require('Immutable');
var assert = require('assert');
var diff = require('../src/diff');
var jsonDiff = require('jsondiff');
var opsAreEqual = require('./opsAreEqual');

var compareDiffs = function(a, b){
  var jsonDiffResult = jsonDiff.diff(a, b);
  var immutableDiffResult = diff(Immutable.fromJS(a), Immutable.fromJS(b));

  assert.ok(jsonDiffResult.every(function(r, i){
    return opsAreEqual(r, immutableDiffResult[i]);
  }));
};

describe('Comparison Tests', function() {
  it('equals json-diff results', function () {
    compareDiffs({}, {});
    compareDiffs([], []);
    compareDiffs([1], [1]);
    compareDiffs(['a'], ['a']);
    compareDiffs([null], [null]);
    compareDiffs([true], [true]);
    compareDiffs([false], [false]);
    compareDiffs({a: 'a', b: 'b'}, {b: 'b', a: 'a'});
    compareDiffs([1, 2, 3], [1, 2, 3]);

    compareDiffs({a: 'a'}, {});
    compareDiffs([[1]], []);
    compareDiffs([], [1]);
  });
});