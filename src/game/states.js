var EntityCreator = {
  player: function() {
    var player = Pixelwars.e('player');
    EntityManager.add(player, new Position());
    EntityManager.add(player, new Motion());
    EntityManager.add(player, new Display(new Sprite('player')));
    return player;
  },
  dungeon: function() {
    var dungeon = Pixelwars.e('djn');
    var map = generateDungeon(80, 50, 4, 12);
    console.log(dumpDungeon(map));
    EntityManager.add(dungeon, new Position());
    //EntityManager.add(dungeon, new Display(new Tilemap(map)));
    return dungeon;
  }
};
/*
var Tilemap = (function(_super) {
  function Tilemap(map) {
    _super.call(this);

    var renderer = new Renderer(map.w * 16, map.h * 16);
    for (var y = map.h; y--;) {
      for (var x = map.w; x--;) {
        var tile;
        var sx = sy = 1;

        switch (map.g(x, y)) {
          case TILE_BLANK:
            tile = 'roof');
            break;

          case TILE_FLOOR:
            tile = 'floor');
            break;

          case TILE_WALL_N:
            tile = 'wall_n');
            break;

          case TILE_WALL_S:
            tile = 'wall_h';
            break;

          case TILE_WALL_W:
            sy = -1;
            // no break!

          case TILE_WALL_E:
            tile = 'wall_v';
            break;

          // Corners are a bit special and need a special treatment!
          case TILE_CORNER:
            break;

          default:
            continue;
        }

        renderer.renderObject(new Sprite(TextureManager.random(texture)));
      }
    }
  }

  return Tilemap;
})(DisplayObject);
*/
var GameState = {
  enter: function(canvas) {
    // Initialize rendering engine
    Buffer.init(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, canvas);

    // Initialize game systems
    SystemManager.register(new PlayerControlSystem());
    SystemManager.register(new MovementSystem());
    SystemManager.register(new RenderingSystem());

    // Generate world
    var dungeon = EntityCreator.dungeon();

    // Create player
    var player = EntityCreator.player();

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
