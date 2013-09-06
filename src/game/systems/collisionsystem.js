function CollisionSystem() {
  System.call(this);
}

__extend(CollisionSystem, System, {
  u: function update(elapsed) {
    // Get player
    var player = __tm.g(TAG_PLAYER);
    var position = player.g(Position);
    var motion = player.g(Motion);
    var bounds = player.g(Bounds);
    var rect = new Rectangle((position.x | 0) + bounds.x, (position.y | 0) + bounds.y, bounds.w, bounds.h);

    // Get world
    var world = __tm.g(TAG_WORLD);
    var map = world.g(Dungeon);


    // World collisions
    // ----------------

    var tileX = (position.x + bounds.x) / 16 | 0;
    var tileY = (position.y + bounds.y) / 16 | 0;
    var tile2X = (position.x + bounds.x + bounds.w - 1) / 16 | 0;
    var tile2Y = (position.y + bounds.y + bounds.h - 1) / 16 | 0;

    if (isWall(map, tileX, tileY) || isWall(map, tile2X, tileY) || isWall(map, tileX, tile2Y) || isWall(map, tile2X, tile2Y)) {
      // Fix position
      position.x -= motion.dx * elapsed;
      position.y -= motion.dy * elapsed;

      // Clear velocity
      motion.dx = motion.dy = 0;
    }


    // Doors collisions
    // ----------------

    var doors = __gm.g(GROUP_DOORS);
    for (var i = doors.length; i--;) {
      var door = doors[i];
      var doorPosition = door.g(Position);
      var doorBounds = door.g(Bounds);
      var doorRect = new Rectangle((doorPosition.x | 0) + doorBounds.x, (doorPosition.y | 0) + doorBounds.y, doorBounds.w, doorBounds.h);
      if (doorRect.overlap(rect)) {
        position.x -= elapsed * motion.dx;
        position.y -= elapsed * motion.dy;
      }
    }
  }
});
