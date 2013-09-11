var EntityCreator = (function() {
  var middleCenter = {x: 0.5, y: 0.5};
  var gibsBlood = ['#c42c00', '#951c00'];
  var gibsSparkles = ['#f5f7b6', '#fcfef0', '#fdd661'];
  var entity;

  function getFourWaysAnimatedSprite(texture) {
    return new AnimatedSprite(__textureManager.g(texture), {
      _n: __textureManager.a('_n'),
      _s: __textureManager.a('_s'),
      _h: __textureManager.a('_h'),
      wn: __textureManager.a('wn'),
      ws: __textureManager.a('ws'),
      wh: __textureManager.a('wh'),
      an: __textureManager.a('an'),
      as: __textureManager.a('as'),
      ah: __textureManager.a('ah')
    }, '_s', middleCenter);
  }

  return {
    door: function(pos) {
      var x = pos.x * 16;
      var y = pos.y * 16;
      if (pos.d > 1) {
        entity = __em.e(
          new Position(x + 8, y + (pos.d > 2 ? 0 : 16)),
          new Bounds(16, 14),
          new Display(new Sprite(__textureManager.g('dh')[0], middleCenter))
        );
      } else {
        entity = __em.e(
          new Position(x + (pos.d ? 16 : 0), y + 3),
          new Bounds(3, 25),
          new Display(new Sprite(__textureManager.g('dv')[0], middleCenter))
        );
      }

      entity.a(new Door());
      entity.a(new Health(2, gibsSparkles));

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
    hero: function(pos) {
      __tm.r(TAG_PLAYER, entity = __em.e(
        new Position(pos.x * 16 + 7, pos.y * 16 + 26),
        new Bounds(6, 13),
        new Motion(),
        new Display(getFourWaysAnimatedSprite('h')),
        new Cooldown(),
        new State(STATE_IDLE)
      ));

      return entity;
    },
    bodyguard: function(pos) {
      __gm.a(GROUP_ENEMIES, entity = __em.e(
        new Position(pos.x * 16 + 7, pos.y * 16 + 10),
        new Bounds(6, 13),
        new Motion(),
        new Display(getFourWaysAnimatedSprite('b')),
        new Health(5, gibsBlood),
        new Brain(),
        new Cooldown(),
        new State(STATE_IDLE)
      ));

      return entity;
    },
    bullet: function(pos) {
      var r = pos.r / 180 * Math.PI;
      var v = !pos.r || pos.r == 180;
      var s;

      __gm.a(GROUP_BULLETS, entity = __em.e(
        new Position(pos.x + (v ? 0 : (pos.r > 0 ? 5 : -5)), pos.y + (v ? (!pos.r ? 10 : -10) : 0), pos.r),
        new Bounds(3, 3),
        new Motion(120 * Math.sin(r) | 0, 120 * Math.cos(r) | 0),
        new Display(s = new Sprite(__textureManager.g(v ? 'bv' : 'bh')[0], v ? {x: 0, y: 1} : {x: 1, y: 0}))
      ));

      s.sx = pos.r < 0 ? -1 : 1;
      s.sy = pos.r == 180 ? -1 : 1;

      return entity;
    },
    gib: function(pos, color, power) {
      var size = !getRandomInt(0, 3) ? 2 : 1;
      return __em.e(
        new Lifetime(power * 0.5),
        new Position(pos.x, pos.y),
        new Motion(power * getRandomInt(-70, 70), power * getRandomInt(-70, 70), 0.95),
        new Display(new Graphics(function(ctx) {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, size, size);
        }), true)
      );
    },
    world: function() {
      var dungeon = generateDungeon(__PW_WORLD_WIDTH, __PW_WORLD_HEIGHT, 4, 7);
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
