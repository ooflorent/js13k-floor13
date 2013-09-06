function SpriteDirectionSystem(layer) {
  IteratingSystem.call(this, Bounds, Motion, Display);
  this.l = layer;
}

__extend(SpriteDirectionSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var bounds = entity.g(Bounds);
    var motion = entity.g(Motion);
    var gfx = entity.g(Display).gfx;

    // Compute direction
    var direction;
    var ar = Math.abs(bounds.r);
    if (ar == 135 || bounds.r == 180) {
      direction = 'n';
    } else if (ar == 45 || !bounds.r) {
      direction = 's';
    } else {
      direction = 'h';
    }

    // Adjust direction
    gfx.sx = bounds.r < 0 ? -1 : 1;

    // Play animation
    gfx.play(((motion.dx || motion.dy) ? '' : '_') + direction);
  }
});
