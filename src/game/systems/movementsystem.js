function MovementSystem() {
  IteratingSystem.call(this, Position, Motion);
}

__extend(MovementSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var motion = entity.g(Motion);

    // Update position
    position.x += elapsed * motion.dx;
    position.y += elapsed * motion.dy;

    // Update direction
    if (motion.dx || motion.dy) {
      position.r = 180 * Math.atan2(motion.dx, motion.dy) / Math.PI;
    }
  }
});
