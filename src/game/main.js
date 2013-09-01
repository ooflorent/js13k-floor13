var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
  t: EntityManager.tag,
  a: EntityManager.add,
  r: EntityManager.remove,

  run: function(canvas) {
    TextureManager.init(__PW_ASSETS_DIR + 'tiles.png', function() {
      // Define tiles
      TextureManager.slice('r', 0, 0, 16, 16);    // Roof
      TextureManager.slice('w', 0, 16, 16, 16);   // North wall
      TextureManager.slice('f', 0, 32, 16, 16);   // Floor
      TextureManager.slice('p', 16, 0, 9, 10, 8); // Player

      TextureManager.anim('_n', [5]);
      TextureManager.anim('_h', [0]);
      TextureManager.anim('_s', [2]);
      TextureManager.anim('n', [7, 6], 6);
      TextureManager.anim('h', [1, 0], 8);
      TextureManager.anim('s', [4, 3], 6);

      // Run game
      GameScreen.enter(canvas);
    });
  }
};
