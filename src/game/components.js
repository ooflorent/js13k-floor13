(function (game) {
  'use strict';

  function Position(x, y) {
    this.x = x;
    this.y = y;
  }

  function Motion(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  game.Position = Position;
  game.Motion = Motion;

})(game);
