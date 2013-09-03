function DirectionFollowSystem() {
  IteratingSystem.call(this, [Position.name, Motion.name, Direction.name]);

  // Listen collision events
  EventManager.on('collision', function(entity) {
    if (this.has(entity)) {
      Pixelwars.r(entity, Direction.name);
    }
  }, this);
}

__extend(DirectionFollowSystem, IteratingSystem, {
  remove: function(entity) {
    // Clear velocity
    var motion = Pixelwars.c(entity, Motion.name);
    motion.dx = motion.dy = 0;
  },
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var motion = Pixelwars.c(entity, Motion.name);
    var direction = Pixelwars.c(entity, Direction.name);

    var diffx = direction.x - position.x;
    var diffy = direction.y - position.y;

    if (Math.abs(diffx) < 2 && Math.abs(diffy) < 2) {
      // Remove component
      Pixelwars.r(entity, Direction.name);
    } else {
      // Compute velocity
      var a = Math.atan2(diffy, diffx);
      motion.dx = Math.cos(a) * 60;
      motion.dy = Math.sin(a) * 60;
    }
  }
});
