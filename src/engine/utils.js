// DOM
// ---

function $(id) {
  return document.getElementById(id);
}

// Array
// -----

/**
 * Computes the intersection of two arrays.
 *
 * @param {array} a An array to compare values against
 * @param {array} b The array with master values to check
 * @return {array}
 */
function intersect(a, b) {
  var results = [], i = b.length;
  while (i--) {
    a.indexOf(b[i]) >= 0 && results.push(b[i]);
  }

  return results;
}

// Math
// ----

function clamp(x, min, max) {
  return x < min ? min : (x > max ? max : x);
}

function getRandomInt(min, max) {
  return min + Math.random() * (max - min + 1) | 0;
}

function getRandomElement(arr) {
  var n = arr.length;
  if (n > 1) {
    return arr[getRandomInt(0, n - 1)];
  } else if (n > 0) {
    return arr[0];
  }

  return null;
}

// Geom
// ----

function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

__define(Rectangle, {
  overlap: function(other) {
    return this.x < (other.x + other.w) && other.x < (this.x + this.w) &&
      this.y < (other.y + other.h) && other.y < (this.y + this.h);
  }
});
