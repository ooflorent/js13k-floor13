var EntityCreator = (function() {
  function getFourWaysAnimatedSprite(texture) {
    return new AnimatedSprite(TextureManager.g(texture), {
      _n: TextureManager.a('_n'), // Idle north
      _s: TextureManager.a('_s'), // Idle south
      _h: TextureManager.a('_h'), // Idle east or west
      n: TextureManager.a('n'),   // Walk north
      s: TextureManager.a('s'),   // Walk south
      h: TextureManager.a('h')    // Walk east of west
    }, '_s', {x: 0.5, y: 1});
  }

  return {
    game: function(cameraLayer) {
      var game = Pixelwars.e('g');
      Pixelwars.a(game, new Camera(cameraLayer));
      return game;
    },
    player: function(pos) {
      var entity = Pixelwars.e('p');
      Pixelwars.a(entity, new Position(pos.x * 16 + 7, pos.y * 16 + 10));
      Pixelwars.a(entity, new Motion());
      Pixelwars.a(entity, new Bounds(-3, -5, 7, 5));
      Pixelwars.a(entity, new Display(getFourWaysAnimatedSprite('p')));
      return entity;
    },
    skeleton: function(pos) {
      var entity = Pixelwars.e();
      Pixelwars.a(entity, new Position(pos.x * 16 + 7, pos.y * 16 + 10));
      Pixelwars.a(entity, new Motion());
      Pixelwars.a(entity, new Bounds(-3, -5, 7, 5));
      Pixelwars.a(entity, new Display(getFourWaysAnimatedSprite('s')));
      return entity;
    },
    dungeon: function() {
      var dungeon = Pixelwars.e('d');
      var map = generateDungeon(20, 16, 4, 7);
      Pixelwars.a(dungeon, map);
      Pixelwars.a(dungeon, new Position());
      Pixelwars.a(dungeon, new Display(new Sprite(new Tilemap(map))));
      if (__PW_DEBUG) {
        console.log(dumpDungeon(map));
      }
      return dungeon;
    }
  };
})();
