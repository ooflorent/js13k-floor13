var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
  t: EntityManager.tag,
  k: Input.get,

  run: function(canvas) {
    TextureManager.init(__PW_ASSETS_DIR + 'tiles.png', function() {
      // Define tiles
      TextureManager.slice('wn', 0, 0, 16, 16, 3);    // North wall
      TextureManager.slice('wh', 64, 0, 16, 16);      // East and west walls
      TextureManager.slice('ws', 48, 16, 16, 16);     // South wall
      TextureManager.slice('c1', 48, 0, 16, 16);      // Corners
      TextureManager.slice('c2', 32, 16, 16, 16);
      TextureManager.slice('c3', 64, 16, 16, 16);
      TextureManager.slice('c4', 16, 16, 16, 16);
      TextureManager.slice('r', 80, 0, 16, 16, 1, 2); // Roof
      TextureManager.slice('f', 0, 16, 16, 16);       // Floor
      TextureManager.slice('p', 0, 32, 9, 10, 8);     // Player

      TextureManager.anim('_n', [5]);
      TextureManager.anim('_h', [0]);
      TextureManager.anim('_s', [2]);
      TextureManager.anim('n', [7, 6], 6);
      TextureManager.anim('h', [1, 0], 8);
      TextureManager.anim('s', [4, 3], 6);

      // Run game
      GameState.enter(canvas);
    });
  }
};
