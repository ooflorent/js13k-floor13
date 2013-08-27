var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
  t: EntityManager.tag,
  k: Input.get,

  run: function(canvas) {
    TextureManager.init(__PW_ASSETS_DIR + 'tiles.png', function() {
      // Define tiles
      TextureManager.slice('wall_n', 0, 0, 16, 16, 3);
      TextureManager.slice('wall_v', 64, 0, 16, 16);
      TextureManager.slice('wall_h', 48, 16, 16, 16);
      TextureManager.slice('wall_c1', 48, 0, 16, 16);
      TextureManager.slice('wall_c2', 32, 16, 16, 16);
      TextureManager.slice('wall_c3', 64, 16, 16, 16);
      TextureManager.slice('roof', 80, 0, 16, 16, 1, 4);
      TextureManager.slice('floor', 0, 16, 16, 16, 2);
      TextureManager.slice('player', 0, 32, 7, 8, 8);
      TextureManager.anim('idl_n', [5]);
      TextureManager.anim('idl_e', [0]);
      TextureManager.anim('idl_s', [2]);
      TextureManager.anim('idl_w', [0]);
      TextureManager.anim('n', [6, 7], 6);
      TextureManager.anim('e', [0, 1], 8);
      TextureManager.anim('s', [3, 4], 6);
      TextureManager.anim('w', [0, 1], 8);

      // Run game
      GameState.enter(canvas);
    });
  }
};
