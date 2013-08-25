var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
  t: EntityManager.tag,
  k: Input.get,

  run: function(canvas) {
    TextureManager.init(__PW_ASSETS_DIR + 'player.png', function() {
      // Define tiles
      TextureManager.slice('player', 0, 0, 9, 14, 5, 2);
      TextureManager.anim('idl_n', [5]);
      TextureManager.anim('idl_e', [6]);
      TextureManager.anim('idl_s', [0]);
      TextureManager.anim('idl_w', [8]);
      TextureManager.anim('n', [3, 4], 80);
      TextureManager.anim('e', [6, 7], 80);
      TextureManager.anim('s', [1, 2], 80);
      TextureManager.anim('w', [8, 9], 80);

      // Initialize rendering engine
      Buffer.init(__PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE, canvas);

      // Initialize game systems
      SystemManager.register(new PlayerControlSystem());
      SystemManager.register(new MovementSystem());
      SystemManager.register(new RenderingSystem());

      // Create player
      var player = EntityCreator.player();

      // Run the game
      SystemManager.init();
      SystemManager.start();
    });
  }
};

var EntityCreator = {
  player: function() {
    var player = Pixelwars.e('player');
    EntityManager.add(player, new Position());
    EntityManager.add(player, new Motion());
    EntityManager.add(player, new Display(new Sprite('player')));
    return player;
  }
};
