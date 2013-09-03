function MovementSystem() {
  IteratingSystem.call(this, [Position.name, Motion.name]);
}

__extend(MovementSystem, IteratingSystem, {
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var motion = Pixelwars.c(entity, Motion.name);

    // Update position
    position.x += elapsed * motion.dx;
    position.y += elapsed * motion.dy;

    // Update direction
    if (motion.dx || motion.dy) {
      position.r = 180 * Math.atan2(motion.dx, motion.dy) / Math.PI;
    }
  }
});
