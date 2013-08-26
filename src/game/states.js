var EntityCreator = {
  player: function() {
    var player = Pixelwars.e('player');
    EntityManager.add(player, new Position());
    EntityManager.add(player, new Motion());
    EntityManager.add(player, new Display(new Sprite('player')));
    return player;
  }
};

var GameState = {
  enter: function(canvas) {
    // Initialize rendering engine
    Buffer.init(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, canvas);

    // Initialize game systems
    SystemManager.register(new PlayerControlSystem());
    SystemManager.register(new MovementSystem());
    SystemManager.register(new RenderingSystem());

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
