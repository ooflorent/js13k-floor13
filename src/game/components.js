(function (game) {
  'use strict';

  function Display(gfx) {
    this.gfx = gfx;
  }

  function Position(x, y) {
    this.x = x;
    this.y = y;
  }

  function Motion(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  game.Display = Display;
  game.Position = Position;
  game.Motion = Motion;

})(game);
