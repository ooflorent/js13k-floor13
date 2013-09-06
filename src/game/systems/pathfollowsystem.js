function PathFollowSystem() {
  IteratingSystem.call(this, Position, Motion, Path);
}

__extend(PathFollowSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var motion = entity.g(Motion);
    var path = entity.g(Path).p;

    var gridPosition = toGrid(position.x, position.y);

    // Remove old way points
    while (path.length && gridPosition.x == path[0].x && gridPosition.y == path[0].y) {
      path.shift();
    }

    // Move to the next point
    if (path.length) {
      var pt = path[0];
      var a = Math.atan2((pt.y + 0.5) * 16 - position.y, (pt.x + 0.5) * 16 - position.x);
      motion.dx = Math.cos(a) * 60;
      motion.dy = Math.sin(a) * 60;
    }
  }
});
