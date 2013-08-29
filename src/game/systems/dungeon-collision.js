function DungeonCollisionSystem() {
  System.call(this);
}

__extend(DungeonCollisionSystem, System, {
  update: function(elapsed) {
    var player = Pixelwars.t('p');
    var dungeon = Pixelwars.t('d');

    var position = Pixelwars.c(player, Position.name);
    var bounds = Pixelwars.c(player, Bounds.name);
    var map = Pixelwars.c(dungeon, Dungeon.name);

    var tileX = (position.x + bounds.x) / 16 | 0;
    var tileY = (position.y + bounds.y) / 16 | 0;

    var tile2X = (position.x + bounds.x + bounds.w - 1) / 16 | 0;
    var tile2Y = (position.y + bounds.y + bounds.h - 1) / 16 | 0;

    if (isWall(map, tileX, tileY) || isWall(map, tile2X, tileY) || isWall(map, tileX, tile2Y) || isWall(map, tile2X, tile2Y)) {
      var motion = Pixelwars.c(player, Motion.name);

      position.x -= motion.dx * elapsed;
      position.y -= motion.dy * elapsed;
    }
  }
});
