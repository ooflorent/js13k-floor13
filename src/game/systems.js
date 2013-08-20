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

    var renderer = new engine.Renderer(960, 720, canvas);
    var stage = new engine.Stage();

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
