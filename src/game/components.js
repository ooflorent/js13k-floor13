function Bounds(x, y, width, height) {
  Rectangle.call(this, x, y, width, height);
  this.r = 0;
}

__extend(Bounds, Rectangle);

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

function Path() {
  this.p = [];
}

function Lifetime(t) {
  this.t = t;
}
