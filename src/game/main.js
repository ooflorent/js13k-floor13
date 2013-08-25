var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
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

      // Initialize game systems
      SystemManager.register(new MovementSystem());
      SystemManager.register(new RenderingSystem(canvas));

      // Run the game
      SystemManager.init();
      SystemManager.start();
    });
  }
};
