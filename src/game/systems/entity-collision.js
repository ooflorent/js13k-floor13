function EntityCollisionSystem() {
  System.call(this);
}

__extend(EntityCollisionSystem, System, {
  update: function(elapsed) {
    var player = Pixelwars.t('p');
    var position = Pixelwars.c(player, Position);
    var motion = Pixelwars.c(player, Motion);
    var bounds = Pixelwars.c(player, Bounds);
    var rect = new Rectangle((position.x | 0) + bounds.x, (position.y | 0) + bounds.y, bounds.w, bounds.h);

    // Check collisions against doors
    var doors = __em.f([Door]);
    for (var i = doors.length; i--;) {
      var door = doors[i];
      var doorPosition = Pixelwars.c(door, Position);
      var doorBounds = Pixelwars.c(door, Bounds);
      var doorRect = new Rectangle((doorPosition.x | 0) + doorBounds.x, (doorPosition.y | 0) + doorBounds.y, doorBounds.w, doorBounds.h);

      // Player collision
      if (doorRect.overlap(rect)) {
        position.x -= elapsed * motion.dx;
        position.y -= elapsed * motion.dy;
      }
    }
  }
});
