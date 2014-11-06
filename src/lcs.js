'use strict';

var Immutable = require('immutable');

/**
 * Returns a two-dimensional array (an array of arrays) with dimensions n by m.
 * All the elements of this new matrix are initially equal to x
 * @param n number of rows
 * @param m number of columns
 * @param x initial element for every item in matrix
 */
var makeMatrix = function(n, m, x){
  var matrix = [];
  for(var i = 0; i < n; i++) {
    matrix[i] = new Array(m);

    if(x != null){
      for(var j = 0; j < m; j++){
        matrix[i][j] = x;
      }
    }
  }

  return matrix;
};

/**
 * Returns longest of two arrays
 * @param xs array 1
 * @param ys array 2
 * @returns {Array} longest of two arrays
 */
var longest = function(xs, ys){
  return xs.size > ys.size ? xs : ys;
};


function computeLcsMatrix(xs, ys) {
  var n = xs.size;
  var m = ys.size;
  var a = makeMatrix(n + 1, m + 1, 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (Immutable.is(xs.get(i), ys.get(j))) {
        a[i + 1][j + 1] = a[i][j] + 1;
      }
      else {
        a[i + 1][j + 1] = Math.max(a[i + 1][j], a[i][j + 1]);
      }
    }
  }

  return a;
}

var backtrackLcs = function(xs, ys, matrix){
  var lcs = [];
  for(var i = xs.size, j = ys.size; i !== 0 && j !== 0;){
    if (matrix[i][j] === matrix[i-1][j]){ i--; }
    else if (matrix[i][j] === matrix[i][j-1]){ j--; }
    else{
      if(Immutable.is(xs.get(i-1), ys.get(j-1))){
        lcs.push(xs.get(i-1));
        i--;
        j--;
      }
    }
  }
  return lcs.reverse();
};

/**
 * Computes Longest Common Subsequence between two Immutable.JS Indexed Iterables
 * Based on Dynamic Programming http://rosettacode.org/wiki/Longest_common_subsequence#Java
 * @param xs ImmutableJS Indexed Sequence 1
 * @param ys ImmutableJS Indexed Sequence 2
 */
var lcs = function(xs, ys){
  var matrix = computeLcsMatrix(xs, ys);

  return backtrackLcs(xs, ys, matrix);
};

module.exports = {
  lcs: lcs,
  computeLcsMatrix: computeLcsMatrix
};