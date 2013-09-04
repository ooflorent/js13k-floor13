var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
  t: EntityManager.tag,
  a: EntityManager.add,
  r: EntityManager.remove,

  run: function(canvas) {
    TextureManager.init(__PW_ASSETS_DIR + 'tiles.png', function() {
      // Dungeon
      TextureManager.slice('r', 0, 0, 16, 16);     // Roof
      TextureManager.slice('w', 0, 16, 16, 16);    // North wall
      TextureManager.slice('f', 0, 32, 16, 16);    // Floor
      TextureManager.slice('sd', 88, 0, 16, 16);   // Down stairs
      TextureManager.slice('su', 89, 17, 15, 22);  // Up stairs
      TextureManager.slice('dh', 110, 0, 16, 17);  // Horizontal door
      TextureManager.slice('dv', 104, 0, 6, 28);   // Vertical door

      // Mobs
      TextureManager.slice('p', 16, 0, 9, 10, 8);  // Player
      TextureManager.slice('s', 16, 10, 9, 10, 8); // Skeleton

      // Effects
      TextureManager.slice('d', 62, 40, 7, 7, 3); // Dash

      TextureManager.anim('_n', [5]);
      TextureManager.anim('_h', [0]);
      TextureManager.anim('_s', [2]);
      TextureManager.anim('n', [7, 6], 6);
      TextureManager.anim('h', [1, 0], 8);
      TextureManager.anim('s', [4, 3], 6);
      TextureManager.anim('d', [0, 1, 2], 12);

      // Run game
      GameScreen.enter(canvas);
    });
  }
};
