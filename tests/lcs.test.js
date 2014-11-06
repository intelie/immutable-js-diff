'use strict';

var Immutable = require('Immutable');
var lcs = require('../src/lcs');
var assert = require('assert');

describe('lcs', function() {

  it('computes for list of chars', function () {
    var str1 = 'thisisatest';
    var str2 = 'testing123testing';
    var expectedStr = 'tsitest';

    var list1 = Immutable.fromJS(str1.split(''));
    var list2 = Immutable.fromJS(str2.split(''));
    var expected = expectedStr.split('');

    var result = lcs.lcs(list1, list2);

    assert.deepEqual(result, expected);
  });

  it('computes for list of integers', function () {
    var array1 = [1,2,3,4];
    var array2 = [1, 2, 2, 4, 5, 3, 3, 3, 2, 4];
    var expected = [1,2,3,4];

    var list1 = Immutable.fromJS(array1);
    var list2 = Immutable.fromJS(array2);

    var result = lcs.lcs(list1, list2);

    assert.deepEqual(result, expected);
  });
});