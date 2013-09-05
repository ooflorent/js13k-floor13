function PathFollowSystem() {
  IteratingSystem.call(this, Position, Motion, Path);
}

__extend(PathFollowSystem, IteratingSystem, {
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var motion = Pixelwars.c(entity, Motion.name);
    var path = Pixelwars.c(entity, Path.name).p;

    var gridPosition = toGrid(position.x, position.y);

    // Remove old way points
    while (path.length && gridPosition.x == path[0].x && gridPosition.y == path[0].y) {
      path.shift();
    }

    if (path.length) {
      var pt = path[0];
      var a = Math.atan2((pt.y + 0.5) * 16 - position.y, (pt.x + 0.5) * 16 - position.x);
      motion.dx = Math.cos(a) * 60;
      motion.dy = Math.sin(a) * 60;
    }
  }
});
