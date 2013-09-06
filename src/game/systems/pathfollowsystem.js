function PathFollowSystem() {
  IteratingSystem.call(this, Bounds, Motion, Path);
}

__extend(PathFollowSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var bounds = entity.g(Bounds);
    var motion = entity.g(Motion);
    var path = entity.g(Path).p;

    var gridPosition = toGrid(bounds.x, bounds.y);

    // Remove old way points
    while (path.length && gridPosition.x == path[0].x && gridPosition.y == path[0].y) {
      path.shift();
    }

    // Move to the next point
    if (path.length) {
      var pt = path[0];
      var a = Math.atan2((pt.y + 0.5) * 16 - bounds.y, (pt.x + 0.5) * 16 - bounds.x);
      motion.dx = Math.cos(a) * 60;
      motion.dy = Math.sin(a) * 60;
    }
  }
});
