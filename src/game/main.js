(function (game) {
  'use strict';

  game.Pixelwars = {
    init: function(canvas) {
      game.r(new game.MovementSystem());
      game.r(new game.RenderingSystem(canvas));
    },
    run: function() {
      game.sm.start();
    }
  };

})(game);
