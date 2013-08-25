function Position(x, y, direction) {
  this.x = x || 0;
  this.y = y || 0;
  this.dir = direction;
}

Position.N = 'n';
Position.E = 'e';
Position.S = 's';
Position.W = 'w';

function Motion(dx, dy) {
  this.dx = dx || 0;
  this.dy = dy || 0;
}

function Display(gfx) {
  this.gfx = gfx;
}
