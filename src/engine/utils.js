// DOM
// ---

/**
 * Return a DOM element.
 *
 * @param  {String} id
 * @return {DOMElement}
 */
function $(id) {
  return document.getElementById(id);
}

// Array
// -----

/**
 * Convert arguments object to an Array.
 *
 * @param  {arguments} args
 * @return {Array}
 */
function argumentsToArray(args) {
  return Array.apply([], args);
}

/**
 * Computes the intersection of two arrays.
 *
 * @param  {Array} a An array to compare values against
 * @param  {Array} b The array with master values to check
 * @return {Array}
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

/**
 * Clamp a number.
 *
 * @param  {int} x
 * @param  {int} min
 * @param  {int} max
 * @return {int}
 */
function clamp(x, min, max) {
  return x < min ? min : (x > max ? max : x);
}

/**
 * Return a random integer.
 *
 * @param  {int} min
 * @param  {int} max
 * @return {int}
 */
function getRandomInt(min, max) {
  return min + Math.random() * (max - min + 1) | 0;
}

/**
 * Return a random element of an array.
 *
 * @param  {Array} arr
 * @return {Object}
 */
function getRandomElement(arr) {
  var n = arr.length;
  if (n > 1) {
    return arr[getRandomInt(0, n - 1)];
  } else if (n) {
    return arr[0];
  }

  return null;
}

// Geom
// ----

/**
 * Creates a rectangle, specifying its properties
 *
 * @param  {float} x
 * @param  {float} y
 * @param  {float} w
 * @param  {float} h
 */
function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

__define(Rectangle, {
  /**
   * Returns whether the specified point is inside this rectangle.
   *
   * @param  {Rectangle} other
   * @return {Boolean}
   */
  c: function contains(x, y) {
    return x >= this.x && x < (this.x + this.w) &&
      y >= this.y && y < (this.y + this.y);
  },
  /**
   * Returns whether or not another rectangle overlaps this one.
   *
   * @param  {Rectangle} other
   * @return {Boolean}
   */
  o: function overlap(other) {
    return this.x < (other.x + other.w) && other.x < (this.x + this.w) &&
      this.y < (other.y + other.h) && other.y < (this.y + this.h);
  }
});
