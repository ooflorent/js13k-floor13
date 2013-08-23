var MovementSystem = (function(_super) {
  function MovementSystem() {
    _super.call(this, [Position.name, Motion.name]);
  }

  extend(MovementSystem, _super);
  define(MovementSystem.prototype, {
    onUpdate: function(entity, elapsed) {
      var position = Pixelwars.c(entity, Position.name);
      var motion = Pixelwars.c(entity, Motion.name);

      position.x = elapsed * motion.dx;
      position.y = elapsed * motion.dy;
    }
  });

  return MovementSystem;
})(IteratingSystem);

var RenderingSystem = (function(_super) {
  function RenderingSystem(canvas) {
    _super.call(this, [Position.name, Display.name]);
    this.canvas = canvas;
  }

  extend(RenderingSystem, _super);
  define(RenderingSystem.prototype, {
    init: function() {
      function gfx(x, y, pattern) {
        var g = new Graphics(Patterns[pattern.charCodeAt(0)], '#f00');
        g.x = x * 10;
        g.y = y * 10;

        return g;
      }

      Buffer.init(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, this.canvas);

      var stage = Buffer.stage;
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
    },
    add: function(entity) {
      Buffer.stage.add(Pixelwars.c(entity, Display.name).gfx);
    },
    remove: function(entity) {
      Buffer.stage.remove(Pixelwars.c(entity, Display.name).gfx);
    },
    update: function(elapsed) {
      Buffer.render();
    }
  });

  return RenderingSystem;
})(System);
