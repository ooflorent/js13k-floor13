var PlayerControlSystem = (function(_super) {
  function PlayerControlSystem() {
    _super.call(this);
  }

  extend(PlayerControlSystem, _super);
  define(PlayerControlSystem.prototype, {
    init: function() {
      Input.keys([37, 38, 39, 40]);
    },
    update: function(elapsed) {
      var player = Pixelwars.t('player');
      var motion = Pixelwars.c(player, Motion.name);
      var gfx = Pixelwars.c(player, Display.name).gfx;

      var x = y = 0;
      if (Pixelwars.k(37)) { // LEFT
        x = -1;
      } else if (Pixelwars.k(39)) { // RIGHT
        x = 1;
      }

      if (Pixelwars.k(38)) { // UP
        y = -1;
      } else if (Pixelwars.k(40)) { // DOWN
        y = 1;
      }

      var length = Math.sqrt(x * x + y * y);
      if (length) {
        motion.dx = x / length * 60;
        motion.dy = y / length * 60;
        motion.dr = 180 * Math.atan2(motion.dx, motion.dy) / Math.PI;
        gfx.play(Position.d(motion.dr));
      } else {
        motion.dx = motion.dy = 0;
        gfx.play('idl_' + Position.d(motion.dr));
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

      position.x += elapsed * motion.dx;
      position.y += elapsed * motion.dy;
      position.r = motion.dr;
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
      var gfx = Pixelwars.c(entity, Display.name).gfx;

      // Update asset orientation
      gfx.sx = (Position.d(position.r) == 'w') ? -1 : 1;

      // Update asset position
      gfx.x = position.x | 0;
      gfx.y = position.y | 0;
    }
  });

  return RenderingSystem;
})(IteratingSystem);
