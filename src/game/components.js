function Position(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = 0;
}

function Bounds(width, height) {
  Rectangle.call(this, 0, 0, width, height);
}

__extend(Bounds, Rectangle, {
  t: function translate(position) {
    this.x = (position.x | 0) - (this.w / 2 | 0);
    this.y = (position.y | 0) - (this.h / 2 | 0);
  }
});

function Motion(dx, dy) {
  this.dx = dx || 0;
  this.dy = dy || 0;
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
