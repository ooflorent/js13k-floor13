function Position(x, y, r) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 0;
}

Position.d = function(r) {
  var rabs = Math.abs(r);
  if (r == 180 || rabs == 135) {
    return 'n';
  } else if (!r || rabs == 45) {
    return 's';
  }

  return 'h';
};

function Motion(dx, dy, dr) {
  this.dx = dx || 0;
  this.dy = dy || 0;
  this.dr = dr || 0;
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
