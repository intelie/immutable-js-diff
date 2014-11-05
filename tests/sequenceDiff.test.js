'use strict';

var diff = require('../src/diff');
var Immutable = require('Immutable');
var JSC = require('jscheck');

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
});