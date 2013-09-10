function Position(x, y, r) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 0;

  this.g = function toGrid() {
    return {
      x: this.x / 16 | 0,
      y: this.y / 16 | 0
    };
  };
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

function Motion(dx, dy, friction) {
  this.dx = dx || 0;
  this.dy = dy || 0;
  this.f = friction || 1;
}

function Display(gfx, fade) {
  this.gfx = gfx;
  this.f = fade;
}

function Lifetime(t) {
  this.m = this.t = t;
}

function State(s) {
  this.s = s;
}

function Health(h, c) {
  this.h = h || 1;
  this.c = c;
}

function Brain() {
  this.p = [];
  this.a = 0;
}

function Door(k) {
  this.k = k;
}
