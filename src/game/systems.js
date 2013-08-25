var PlayerControlSystem = (function(_super) {
  function PlayerControlSystem() {
    _super.call(this);
  }

  extend(PlayerControlSystem, _super);
  define(PlayerControlSystem.prototype, {
    init: function() {
      //Input.capture = [37, 38, 39, 40];
    },
    update: function(elapsed) {
      var player = Pixelwars.t('player');
      var motion = Pixelwars.c(player, Motion.name);

      // Reset component
      motion.dx = motion.dy = 0;

      if (Pixelwars.k(38)) { // UP
        motion.dy = -200;
      } else if (Pixelwars.k(40)) { // DOWN
        motion.dy = 200;
      }

      if (Pixelwars.k(37)) { // LEFT
        motion.dx = -200;
      } else if (Pixelwars.k(39)) { // RIGHT
        motion.dx = 200;
      }
    }
  });

  return PlayerControlSystem;
})(System);

var MovementSystem = (function(_super) {
  function MovementSystem() {
    _super.call(this, [Position.name, Motion.name]);
  }

  extend(MovementSystem, _super);
  define(MovementSystem.prototype, {
    onUpdate: function(entity, elapsed) {
      var position = Pixelwars.c(entity, Position.name);
      var motion = Pixelwars.c(entity, Motion.name);

      if (motion.dx || motion.dy) {
        var hDir = motion.dx < 0 ? Position.W : Position.E;
        var vDir = motion.dy < 0 ? Position.N : Position.S;

        position.dir = Math.abs(motion.dx) < Math.abs(motion.dy) ? vDir : hDir;
      }

      position.x += elapsed * motion.dx;
      position.y += elapsed * motion.dy;
    }
  });

  return MovementSystem;
})(IteratingSystem);

var RenderingSystem = (function(_super) {
  function RenderingSystem() {
    _super.call(this, [Position.name, Display.name]);
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
      _super.prototype.update.call(this, elapsed);
      Buffer.render(elapsed);
    },
    onUpdate: function(entity, elapsed) {
      var position = Pixelwars.c(entity, Position.name);
      var display = Pixelwars.c(entity, Display.name);

      if (position.dir) {
        display.gfx.play(position.dir);
      }

      display.gfx.x = position.x | 0;
      display.gfx.y = position.y | 0;
    }
  });

  return RenderingSystem;
})(IteratingSystem);
