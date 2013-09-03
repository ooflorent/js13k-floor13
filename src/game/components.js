function Position(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = 0;
}

function Motion(dx, dy) {
  this.dx = dx || 0;
  this.dy = dy || 0;
}

function Camera(layer) {
  this.l = layer;
}

function Display(gfx) {
  this.gfx = gfx;
}

function Bounds(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.w = width;
  this.h = height;
}

function Path() {
  this.p = [];
}
