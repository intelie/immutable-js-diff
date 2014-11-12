'use strict';

var Immutable = require('Immutable');
var assert = require('assert');
var diff = require('../src/diff');
var jsonDiff = require('jsondiff');

var compareDiffs = function(a, b){
  var jsonDiffResult = Immutable.fromJS(jsonDiff.diff(a, b));
  var immutableDiffResult = diff(Immutable.fromJS(a), Immutable.fromJS(b));

  assert.ok(Immutable.is(jsonDiffResult, immutableDiffResult));
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

    compareDiffs([], [[1]]);

    compareDiffs([2, 3], [1, 2, 3]);
    compareDiffs([1, 3], [1, 2, 3]);
    compareDiffs([1, 2], [1, 2, 3]);
    compareDiffs([1, 2, 3], [1, 4, 3]); 

    compareDiffs({a: [9, 8, 7], b: 2, c: 3}, {a: [9, 7], b: 2, c: 4, d: 5});

    compareDiffs([1, 0, 0], [1, 1, 0]); 
    compareDiffs([1, 1, 0], [1, 0, 0]);

    compareDiffs({foo: 'bar'}, {baz: 'qux', foo: 'bar'});
    compareDiffs({foo: ['bar', 'baz']}, {foo: ['bar', 'qux', 'baz']});
    compareDiffs({baz: 'qux', foo: 'bar'}, {foo: 'bar'});
    compareDiffs({foo: ['bar', 'qux', 'baz']}, {foo: ['bar', 'baz']});
    compareDiffs({baz: 'qux', foo: 'bar'}, {baz: 'boo', foo: 'bar'});
    compareDiffs({foo: 'bar'}, {foo: 'bar', child: {grandchild: {}}});
    compareDiffs({foo: ['bar']}, {foo: ['bar', ['abc', 'def']]});

    compareDiffs([0, 0], [1, 1]); 
  });
});