function PlayerControlSystem() {
  System.call(this);
}

__extend(PlayerControlSystem, System, {
  init: function() {
    Input.keys([37, 38, 39, 40]);
  },
  update: function(elapsed) {
    var player = Pixelwars.t('p');
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
      gfx.play('_' + Position.d(motion.dr));
    }

    gfx.sx = motion.dr < 0 ? -1 : 1;
  }
});

function MovementSystem() {
  IteratingSystem.call(this, [Position.name, Motion.name]);
}

__extend(MovementSystem, IteratingSystem, {
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var motion = Pixelwars.c(entity, Motion.name);

    position.x += elapsed * motion.dx;
    position.y += elapsed * motion.dy;
    position.r = motion.dr;
  }
});

function RenderingSystem() {
  IteratingSystem.call(this, [Position.name, Display.name]);
}

__extend(RenderingSystem, IteratingSystem, {
  add: function(entity) {
    Buffer.stage.add(Pixelwars.c(entity, Display.name).gfx);
  },
  remove: function(entity) {
    Buffer.stage.remove(Pixelwars.c(entity, Display.name).gfx);
  },
  update: function(elapsed) {
    IteratingSystem.prototype.update.call(this, elapsed);
    Buffer.render(elapsed);
  },
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var gfx = Pixelwars.c(entity, Display.name).gfx;

    // Update asset position
    gfx.x = position.x | 0;
    gfx.y = position.y | 0;
  }
});

function CameraSystem() {
  System.call(this);
}

__extend(CameraSystem, System, {
  update: function(elapsed) {
    var position = Pixelwars.c(Pixelwars.t('p'), Position.name);
    var map = Pixelwars.c(Pixelwars.t('d'), Display.name).gfx.texture.frame;
    var renderer = Buffer.renderer;

    renderer.cx = clamp(position.x - renderer.w / 2 | 0, 0, map.w - renderer.w);
    renderer.cy = clamp(position.y - renderer.h / 2 | 0, 0, map.h - renderer.h);
  }
});
