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

function DungeonCollisionSystem() {
  System.call(this);
}

__extend(DungeonCollisionSystem, System, {
  update: function(elapsed) {
    var player = Pixelwars.t('p');
    var dungeon = Pixelwars.t('d');

    var position = Pixelwars.c(player, Position.name);
    var bounds = Pixelwars.c(player, Bounds.name);
    var map = Pixelwars.c(dungeon, Dungeon.name);

    var tileX = (position.x + bounds.x) / 16 | 0;
    var tileY = (position.y + bounds.y) / 16 | 0;

    var tile2X = (position.x + bounds.x + bounds.w - 1) / 16 | 0;
    var tile2Y = (position.y + bounds.y + bounds.h - 1) / 16 | 0;

    if (isWall(map, tileX, tileY) || isWall(map, tile2X, tileY) || isWall(map, tileX, tile2Y) || isWall(map, tile2X, tile2Y)) {
      var motion = Pixelwars.c(player, Motion.name);

      position.x -= motion.dx * elapsed;
      position.y -= motion.dy * elapsed;
    }
  }
});

function RenderingSystem(layer) {
  IteratingSystem.call(this, [Position.name, Display.name]);
  this.l = layer;
}

__extend(RenderingSystem, IteratingSystem, {
  add: function(entity) {
    this.l.add(Pixelwars.c(entity, Display.name).gfx);
  },
  remove: function(entity) {
    this.l.remove(Pixelwars.c(entity, Display.name).gfx);
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

if (__PW_DEBUG) {
  function BoundsRenderingSystem(layer) {
    IteratingSystem.call(this, [Position.name, Bounds.name]);
    this.l = layer;
  }

  __extend(BoundsRenderingSystem, IteratingSystem, {
    add: function(entity) {
      var bounds = Pixelwars.c(entity, Bounds.name);

      bounds.gfx = new Graphics(function(ctx, color) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,255,0,.5)';
        ctx.strokeRect(bounds.x + 0.5, bounds.y + 0.5, bounds.w - 1, bounds.h - 1);
        ctx.closePath();
      });

      this.l.add(bounds.gfx);
    },
    remove: function(entity) {
      this.l.remove(Pixelwars.c(entity, Bounds.name).gfx);
    },
    onUpdate: function(entity) {
      var position = Pixelwars.c(entity, Position.name);
      var bounds = Pixelwars.c(entity, Bounds.name);

      bounds.gfx.x = position.x | 0;
      bounds.gfx.y = position.y | 0;
    }
  });
}
