'use strict';

var assert = require('assert');
var path = require('../src/path');

describe('Path', function() {
  it('escape / in string', function () {
    var str = 'prop/prop';
    var expected = 'prop~1prop';

    var result = path.escape(str);

    assert.strictEqual(result, expected);
  });

  it('unescape / in string', function () {
    var str = 'prop~1prop';
    var expected = 'prop/prop';

    var result = path.unescape(str);

    assert.strictEqual(result, expected);
  });

  it('reverts to original string', function () {
    var str = 'prop/prop';

    var result = path.unescape(path.escape(str));

    assert.strictEqual(result, str);
  });

  it('returns same string when escaping is not necessary', function() {
    var str = 'normalstring';

    var result = path.escape(str);

    assert.strictEqual(result, str);
  });

  it('concatenates path', function() {
    var p = '/path';
    var pathToAdd = 'addedPath';

    var result = path.concat(p, pathToAdd);
    var expected = '/path/addedPath';

    assert.strictEqual(result, expected);
  });
});