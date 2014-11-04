'use strict';

var diff = require('../src/diff');
var Immutable = require('Immutable');
var expect = require('expect.js');

describe('Map diff', function(){
  it('returns [] when equal', function(){
    var map1 = Immutable.Map({a: 1});
    var map2 = Immutable.Map({a: 1});

    var result = diff.diff(map1, map2);

    expect(result).to.be.empty();
  });

  it('returns add op when missing attribute', function(){
    var map1 = Immutable.Map({a: 1});
    var map2 = Immutable.Map({a: 1, b:2});

    var result = diff.diff(map1, map2);
    var expected = [{op: 'add', path: '/b', value: 2}]

    expect(result[0].op).to.be(expected[0].op);
    expect(result[0].path).to.be(expected[0].path);
    expect(result[0].value).to.be(expected[0].value);
  });
});