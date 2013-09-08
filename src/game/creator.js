var EntityCreator = (function() {
  var bottomCenter = {x: 0.5, y: 0.8};
  var middleCenter = {x: 0.5, y: 0.5};
  var entity;

  function getFourWaysAnimatedSprite(texture) {
    return new AnimatedSprite(__textureManager.g(texture), {
      _n: __textureManager.a('_n'), // Idle north
      _s: __textureManager.a('_s'), // Idle south
      _h: __textureManager.a('_h'), // Idle east or west
      n: __textureManager.a('n'),   // Walk north
      s: __textureManager.a('s'),   // Walk south
      h: __textureManager.a('h')    // Walk east of west
    }, '_s', bottomCenter);
  }

  return {
    entrance: function(pos) {
      __gm.a(GROUP_PORTALS, entity = __em.e(
        new Position(pos.x * 16 + 8, pos.y * 16 + 8),
        new Bounds(16, 16),
        new Display(new Sprite(__textureManager.g('sd')[0], middleCenter))
      ));

      return entity;
    },
    exit: function(pos) {
      __gm.a(GROUP_PORTALS, entity = __em.e(
        new Position(pos.x * 16 + 9, pos.y * 16 + 7),
        new Bounds(15, 22),
        new Display(new Sprite(__textureManager.g('su')[0], middleCenter))
      ));

      return entity;
    },
    door: function(pos) {
      var x = pos.x * 16;
      var y = pos.y * 16;
      if (pos.d > 1) {
        entity = __em.e(
          new Position(x + 8, y + (pos.d > 2 ? 0 : 16)),
          new Bounds(16, 17),
          new Display(new Sprite(__textureManager.g('dh')[0], middleCenter))
        );
      } else {
        entity = __em.e(
          new Position(x + (pos.d ? 16 : 0), y + 3),
          new Bounds(3, 25),
          new Display(new Sprite(__textureManager.g('dv')[0], middleCenter))
        );
      }

      __gm.a(GROUP_DOORS, entity);
      return entity;
    },
    dash: function(pos) {
      var gfx = new AnimatedSprite(__textureManager.g('d'), {d: __textureManager.a('d')}, 'd', middleCenter);
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
        new Bounds(7, 7),
        new Display(gfx),
        new Lifetime(0.1)
      ));

      return entity;
    },
    player: function(pos) {
      __tm.r(TAG_PLAYER, entity = __em.e(
        new Position(pos.x * 16 + 7, pos.y * 16 + 10),
        new Bounds(7, 5),
        new Motion(),
        new Display(getFourWaysAnimatedSprite('p')),
        new Cooldown()
      ));

      return entity;
    },
    skeleton: function(pos) {
      __gm.a(GROUP_ENEMIES, entity = __em.e(
        new Position(pos.x * 16 + 7, pos.y * 16 + 10),
        new Bounds(7, 5),
        new Motion(),
        new Display(getFourWaysAnimatedSprite('s'))
      ));

      return entity;
    },
    world: function() {
      var dungeon = generateDungeon(20, 16, 4, 7);
      if (__PW_DEBUG) {
        console.log(dumpDungeon(dungeon));
      }

      __tm.r(TAG_WORLD, entity = __em.e(
        new Position(),
        new Display(new Sprite(new Tilemap(dungeon))),
        dungeon
      ));

      return entity;
    }
  };
})();
