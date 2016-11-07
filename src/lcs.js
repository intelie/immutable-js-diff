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
 * Computes Longest Common Subsequence between two Immutable.JS Indexed Iterables
 * Based on Dynamic Programming http://rosettacode.org/wiki/Longest_common_subsequence#Java
 * @param xs ImmutableJS Indexed Sequence 1
 * @param ys ImmutableJS Indexed Sequence 2
 */
var lcs = function(xs, ys){
  var matrix = computeLcsMatrix(xs, ys);

  return backtrackLcs(xs, ys, matrix);
};

var DiffResult = Immutable.Record({op: '=', val: null});
var ReplaceResult = Immutable.Record({op: '!=', val: null, newVal: null});

/**
 * Returns the resulting diff operations of LCS between two sequences
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 * @returns Array of DiffResult {op:'=' | '+' | '-', val:any}
 */
var diff = function(xs, ys){
  var matrix = computeLcsMatrix(xs, ys);

  return printDiff(matrix, xs, ys, xs.size||0, ys.size||0);
};

var printDiff = function(matrix, xs, ys, xSize, ySize) {
  var diffArray = [];
  var i = xSize - 1;
  var j = ySize - 1;
  while (i >= 0 || j >= 0) {
    if (i >= 0 && j >= 0 && Immutable.is(xs.get(i), ys.get(j))) {
      diffArray.push(new DiffResult({
        op: '=',
        val: xs.get(i)
      }));
      i -= 1;
      j -= 1;
    }
    else if (i >= 0 && j >= 0 && i === j && !Immutable.is(xs.get(i), ys.get(j))) {
      diffArray.push(new ReplaceResult({
      val: xs.get(i),
      newVal: ys.get(i)
      }));
      i -= 1;
      j -= 1;
    }
    else {
      if (j >= 0 && (i === -1 || matrix[i+1][j] >= matrix[i][j+1])) {
        diffArray.push(new DiffResult({
          op: '+',
          val: ys.get(j)
        }));
        j -= 1;
      }
      else if (i >= 0 && (j === -1 || matrix[i+1][j] < matrix[i][j+1])){
        diffArray.push(new DiffResult({
          op: '-',
          val: xs.get(i)
        }));
        i -= 1;
      }
    }
  }
  return diffArray.reverse();
};

/**
 * Computes the Longest Common Subsequence table
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 */
function computeLcsMatrix(xs, ys) {
  var n = xs.size||0;
  var m = ys.size||0;
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

/**
 * Extracts a LCS from matrix M
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 * @param matrix LCS Matrix
 * @returns {Array.<T>} Longest Common Subsequence
 */
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

module.exports = {
  lcs: lcs,
  computeLcsMatrix: computeLcsMatrix,
  diff: diff
};
