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
});