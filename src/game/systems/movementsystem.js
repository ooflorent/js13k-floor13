function MovementSystem() {
  IteratingSystem.call(this, Bounds, Motion);
}

__extend(MovementSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var bounds = entity.g(Bounds);
    var motion = entity.g(Motion);

    // Update position
    bounds.x += motion.dx * elapsed;
    bounds.y += motion.dy * elapsed;

    // Update direction
    if (motion.dx || motion.dy) {
      bounds.r = 180 * Math.atan2(motion.dx, motion.dy) / Math.PI;
    }
  }
});
