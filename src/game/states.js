var EntityCreator = {
  player: function(pos) {
    var player = Pixelwars.e('p');
    EntityManager.add(player, new Position(pos.x * 16 + 3, pos.y * 16 + 3));
    EntityManager.add(player, new Motion());
    EntityManager.add(player, new Bounds(1, 5, 7, 5));
    EntityManager.add(player, new Display(new AnimatedSprite(TextureManager.get('p'), {
      _n: TextureManager.a('_n'), // Idle north
      _s: TextureManager.a('_s'), // Idle south
      _h: TextureManager.a('_h'), // Idle east or west
      n: TextureManager.a('n'),   // Walk north
      s: TextureManager.a('s'),   // Walk south
      h: TextureManager.a('h')    // Walk east of west
    }, '_s')));
    return player;
  },
  dungeon: function() {
    var dungeon = Pixelwars.e('d');
    var map = generateDungeon(20, 15, 4, 7);
    EntityManager.add(dungeon, map);
    EntityManager.add(dungeon, new Position());
    EntityManager.add(dungeon, new Display(new Sprite(new Tilemap(map))));
    return dungeon;
  }
};

function Tilemap(map) {
  RenderTexture.call(this, map.w * 16, map.h * 16);

  var tile = new Sprite();
  for (var y = map.h; y--;) {
    for (var x = map.w; x--;) {
      var texture;
      var sx = sy = 1;

      switch (map.g(x, y)) {
        case TILE_BLANK:
          texture = 'r';
          break;

        case TILE_WALL_N:
          texture = 'wn';
          break;

        case TILE_WALL_S:
          texture = 'ws';
          break;

        case TILE_WALL_W:
          sx = -1;
          // no break!

        case TILE_WALL_E:
          texture = 'wh';
          break;

        // Corners are a bit special and need a special treatment!
        case TILE_CORNER:
          var n = isWall(map, x, y - 1);
          var s = isWall(map, x, y + 1);
          var w = isWall(map, x - 1, y);
          var e = isWall(map, x + 1, y);
          var nw = isWall(map, x - 1, y - 1);
          var ne = isWall(map, x + 1, y - 1);
          var sw = isWall(map, x - 1, y + 1);
          var se = isWall(map, x + 1, y + 1);

          if (!s && !w) {
            texture = 'c1';
          } else if (!s && !e) {
            texture = 'c1';
            sx = -1;
          } else if (!n && !w) {
            texture = 'c2';
          } else if (!n && !e) {
            texture = 'c2';
            sx = -1;
          } else if (n && e && !ne) {
            texture = 'c3';
            sx = -1;
          } else if (n && w && !nw) {
            texture = 'c3';
          } else if (s && e && !se) {
            texture = 'c4';
            sx = -1;
          } else {
            texture = 'c4';
          }
          break;

        case TILE_FLOOR:
        default:
          texture = 'f';
      }

      tile.texture = TextureManager.random(texture);
      tile.sx = sx;
      tile.sy = sy;

      this.render(tile, {x: x * 16, y: y * 16});
    }
  }
}

__extend(Tilemap, RenderTexture);

var GameState = {
  enter: function(canvas) {
    // Initialize rendering engine
    Buffer.init(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, canvas);

    var stage = Buffer.stage;
    var gameLayer = new DisplayObjectContainer();
    stage.add(gameLayer);

    // Initialize game systems
    SystemManager.register(new PlayerControlSystem());
    SystemManager.register(new MovementSystem());
    SystemManager.register(new DungeonCollisionSystem());
    SystemManager.register(new CameraSystem());

    if (__PW_DEBUG) {
      var debugLayer = new DisplayObjectContainer();
      stage.add(debugLayer);

      SystemManager.register(new BoundsRenderingSystem(debugLayer));
    }

    SystemManager.register(new RenderingSystem(gameLayer));

    // Generate world
    var dungeon = EntityCreator.dungeon();

    // Create player
    var player = EntityCreator.player(Pixelwars.c(dungeon, Dungeon.name).prev);

    // Run the game
    SystemManager.start();
  },
  exit: function() {
    SystemManager.stop();
    SystemManager.clear();
    EventManager.clear();
    EntityManager.clear();
  }
};
