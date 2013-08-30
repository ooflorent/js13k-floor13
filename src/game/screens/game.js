var EntityCreator = {
  game: function(cameraLayer) {
    var game = Pixelwars.e('g');
    EntityManager.add(game, new Camera(cameraLayer));
    return game;
  },
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

var GameScreen = {
  enter: function(canvas) {
    // Create game layers
    var stage = new Stage();
    var cameraLayer = stage.add(new DisplayObjectContainer());
    var hudLayer    = stage.add(new DisplayObjectContainer());
    var gameLayer   = cameraLayer.add(new DisplayObjectContainer());

    // Initialize rendering engine
    Buffer.init(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, canvas, stage);

    // Initialize game systems
    SystemManager.register(new KeyboardPlayerControlSystem());
    SystemManager.register(new MousePlayerControlSystem());
    SystemManager.register(new MovementSystem());
    SystemManager.register(new DungeonCollisionSystem());
    SystemManager.register(new CameraSystem(cameraLayer));

    if (__PW_DEBUG) {
      var debugLayer = cameraLayer.add(new DisplayObjectContainer());
      SystemManager.register(new BoundsRendererSystem(debugLayer));
    }

    SystemManager.register(new SpriteRendererSystem(gameLayer));

    // Generate world
    var dungeon = EntityCreator.dungeon();
    var map = Pixelwars.c(dungeon, Dungeon.name);

    // Initialize path finder
    AStar.init(map, isWallTile);

    // Create game
    var game = EntityCreator.game(cameraLayer);

    // Create player
    var player = EntityCreator.player(map.prev);

    // Run the game
    SystemManager.start();
  },
  exit: function() {
    Buffer.clear();
    SystemManager.stop();
    SystemManager.clear();
    EventManager.clear();
    EntityManager.clear();
  }
};
