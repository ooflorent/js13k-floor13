var EntityCreator = (function() {
  function createPortal(texture, x, y) {
    var entity = Pixelwars.e();
    Pixelwars.a(entity, new Position(x, y));
    Pixelwars.a(entity, new Display(new Sprite(TextureManager.g(texture)[0])));
    return entity;
  }

  function getFourWaysAnimatedSprite(texture) {
    return new AnimatedSprite(TextureManager.g(texture), {
      _n: TextureManager.a('_n'), // Idle north
      _s: TextureManager.a('_s'), // Idle south
      _h: TextureManager.a('_h'), // Idle east or west
      n: TextureManager.a('n'),   // Walk north
      s: TextureManager.a('s'),   // Walk south
      h: TextureManager.a('h')    // Walk east of west
    }, '_s', {x: 0.5, y: 1});
  }

  return {
    game: function(cameraLayer) {
      var game = Pixelwars.e('g');
      Pixelwars.a(game, new Camera(cameraLayer));
      return game;
    },
    entrance: function(pos) {
      return createPortal('sd', pos.x * 16, pos.y * 16);
    },
    exit: function(pos) {
      return createPortal('su', pos.x * 16 + 2, pos.y * 16 - 4);
    },
    door: function(pos) {
      var entity = Pixelwars.e();
      var x = pos.x * 16 + (pos.d > 1 ? 0 : (pos.d ? 13 : -3));
      var y = pos.y * 16 + (pos.d > 2 ? -8 : (pos.d > 1 ? 8 : -12));
      Pixelwars.a(entity, new Door());
      Pixelwars.a(entity, new Position(x, y));
      Pixelwars.a(entity, pos.d > 1 ? new Bounds(0, 0, 16, 16) : new Bounds(0, 0, 6, 28));
      Pixelwars.a(entity, new Display(new Sprite(TextureManager.g(pos.d > 1 ? 'dh' : 'dv')[0])));
      return entity;
    },
    dash: function(pos) {
      var entity = Pixelwars.e(), gfx, x = pos.x - 2, y = pos.y - 7;
      Pixelwars.a(entity, new Dash());
      Pixelwars.a(entity, new Display(gfx = new AnimatedSprite(TextureManager.g('d'), {d: TextureManager.a('d')}, 'd')));
      Pixelwars.a(entity, new Lifetime(0.1));
      if (pos.r < 0) {
        gfx.sx = -1;
        x -= 1;
      } else if (pos.r > 90) {
        gfx.sy = -1;
        y += 2;
      } else if (pos.r) {
        x += 5;
      } else {
        y += 4;
      }
      Pixelwars.a(entity, new Position(x, y));
      return entity;
    },
    player: function(pos) {
      var entity = Pixelwars.e('p');
      Pixelwars.a(entity, new Player());
      Pixelwars.a(entity, new Position(pos.x * 16 + 7, pos.y * 16 + 10));
      Pixelwars.a(entity, new Motion());
      Pixelwars.a(entity, new Bounds(-3, -5, 7, 5));
      Pixelwars.a(entity, new Display(getFourWaysAnimatedSprite('p')));
      return entity;
    },
    skeleton: function(pos) {
      var entity = Pixelwars.e();
      Pixelwars.a(entity, new Position(pos.x * 16 + 7, pos.y * 16 + 10));
      Pixelwars.a(entity, new Motion());
      Pixelwars.a(entity, new Bounds(-3, -5, 7, 5));
      Pixelwars.a(entity, new Display(getFourWaysAnimatedSprite('s')));
      return entity;
    },
    dungeon: function() {
      var dungeon = Pixelwars.e('d');
      var map = generateDungeon(20, 16, 4, 7);
      Pixelwars.a(dungeon, map);
      Pixelwars.a(dungeon, new Position());
      Pixelwars.a(dungeon, new Display(new Sprite(new Tilemap(map))));
      if (__PW_DEBUG) {
        console.log(dumpDungeon(map));
      }
      return dungeon;
    }
  };
})();
