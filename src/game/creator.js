var EntityCreator = (function() {
  var entity;

  function createPortal(texture, x, y) {
    __gm.a(GROUP_PORTALS, entity = __em.e(
      new Position(x, y),
      new Display(new Sprite(__textureManager.g(texture)[0]))
    ));

    return entity;
  }

  function getFourWaysAnimatedSprite(texture) {
    return new AnimatedSprite(__textureManager.g(texture), {
      _n: __textureManager.a('_n'), // Idle north
      _s: __textureManager.a('_s'), // Idle south
      _h: __textureManager.a('_h'), // Idle east or west
      n: __textureManager.a('n'),   // Walk north
      s: __textureManager.a('s'),   // Walk south
      h: __textureManager.a('h')    // Walk east of west
    }, '_s', {x: 0.5, y: 1});
  }

  return {
    entrance: function(pos) {
      return createPortal('sd', pos.x * 16, pos.y * 16);
    },
    exit: function(pos) {
      return createPortal('su', pos.x * 16 + 2, pos.y * 16 - 4);
    },
    door: function(pos) {
      var x = pos.x * 16 + (pos.d > 1 ? 0 : (pos.d ? 13 : -3));
      var y = pos.y * 16 + (pos.d > 2 ? -8 : (pos.d > 1 ? 8 : -12));

      __gm.a(GROUP_DOORS, entity = __em.e(
        new Position(x, y),
        new Display(new Sprite(__textureManager.g(pos.d > 1 ? 'dh' : 'dv')[0])),
        pos.d > 1 ? new Bounds(0, 0, 16, 16) : new Bounds(0, 0, 6, 28)
      ));

      return entity;
    },
    dash: function(pos) {
      var gfx = new AnimatedSprite(__textureManager.g('d'), {d: __textureManager.a('d')}, 'd');
      var x = pos.x - 2;
      var y = pos.y - 7;

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

      __gm.a(GROUP_DASHES, entity = __em.e(
        new Position(x, y),
        new Display(gfx),
        new Lifetime(0.1)
      ));

      return entity;
    },
    player: function(pos) {
      __tm.r(TAG_PLAYER, entity = __em.e(
        new Position(pos.x * 16 + 7, pos.y * 16 + 10),
        new Motion(),
        new Bounds(-3, -5, 7, 5),
        new Display(getFourWaysAnimatedSprite('p'))
      ));

      return entity;
    },
    skeleton: function(pos) {
      __gm.a(GROUP_ENEMIES, entity = __em.e(
        new Position(pos.x * 16 + 7, pos.y * 16 + 10),
        new Motion(),
        new Bounds(-3, -5, 7, 5),
        new Display(getFourWaysAnimatedSprite('s'))
      ));

      return entity;
    },
    dungeon: function() {
      var map = generateDungeon(20, 16, 4, 7);
      if (__PW_DEBUG) {
        console.log(dumpDungeon(map));
      }

      __tm.r(TAG_WORLD, entity = __em.e(
        new Position(),
        new Display(new Sprite(new Tilemap(map))),
        map
      ));

      return entity;
    }
  };
})();
