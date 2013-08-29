// DOM
// ---

function $(id) {
  return document.getElementById(id);
}

// Collections
// -----------

function Array2(width, height) {
  this.w = width;
  this.h = height;
  this.d = new Uint8Array(width * height);
}

__define(Array2, {
  g: function(x, y) {
    return this.d[y * this.w + x];
  },
  s: function(x, y, value) {
    this.d[y * this.w + x] = value;
  },
  p: function(arr2, x, y) {
    for (var ay = arr2.h; ay--;) {
      for (var ax = arr2.w; ax--;) {
        this.s(x + ax, y + ay, arr2.g(ax, ay));
      }
    }
  }
});

// Math
// ----

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
