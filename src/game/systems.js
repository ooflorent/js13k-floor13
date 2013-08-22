(function (game, engine) {
  'use strict';

  var Position = game.Position;
  var Motion = game.Motion;
  var Display = game.Display;

  game.MovementSystem = function() {
    engine.IteratingSystem.call(this, [Position.name, Motion.name], function(entity, elapsed) {
      var position = game.c(entity, Position.name);
      var motion = game.c(entity, Motion.name);

      position.x = elapsed * motion.dx;
      position.y = elapsed * motion.dy;
    });
  };

  game.RenderingSystem = function(canvas) {
    engine.System.call(this, [Position.name, Display.name]);

    var renderer = new engine.Renderer(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, canvas);
    var stage = new engine.Stage();

    this.init = function() {

      function gfx(x, y, pattern) {
        var g = new engine.Graphics(game.Patterns[pattern.charCodeAt(0)], '#f00', '#f00');
        g.x = x * 10;
        g.y = y * 10;

        return g;
      }

      stage.add(gfx(1, 1, '╔'));
      stage.add(gfx(2, 1, '═'));
      stage.add(gfx(3, 1, '╦'));
      stage.add(gfx(4, 1, '═'));
      stage.add(gfx(5, 1, '╗'));

      stage.add(gfx(1, 2, '║'));
      stage.add(gfx(2, 2, '░'));
      stage.add(gfx(3, 2, '║'));
      stage.add(gfx(4, 2, '░'));
      stage.add(gfx(5, 2, '║'));

      stage.add(gfx(1, 3, '╠'));
      stage.add(gfx(2, 3, '═'));
      stage.add(gfx(3, 3, '╬'));
      stage.add(gfx(4, 3, '═'));
      stage.add(gfx(5, 3, '╣'));

      stage.add(gfx(1, 4, '║'));
      stage.add(gfx(2, 4, '▓'));
      stage.add(gfx(3, 4, '║'));
      stage.add(gfx(4, 4, '▓'));
      stage.add(gfx(5, 4, '║'));

      stage.add(gfx(1, 5, '╚'));
      stage.add(gfx(2, 5, '═'));
      stage.add(gfx(3, 5, '╩'));
      stage.add(gfx(4, 5, '═'));
      stage.add(gfx(5, 5, '╝'));
    };

    this.add = function(entity) {
      stage.add(game.c(entity, Display.name).gfx);
    };

    this.remove = function(entity) {
      stage.remove(game.c(entity, Display.name).gfx);
    };

    this.update = function(elapsed) {
      renderer.render(stage);
    };
  };

})(game, engine);
