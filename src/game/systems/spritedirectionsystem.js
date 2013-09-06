function SpriteDirectionSystem(layer) {
  IteratingSystem.call(this, Position, Motion, Display);
  this.l = layer;
}

__extend(SpriteDirectionSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var motion = entity.g(Motion);
    var gfx = entity.g(Display).gfx;

    // Compute direction
    var direction;
    var ar = Math.abs(position.r);
    if (ar == 135 || position.r == 180) {
      direction = 'n';
    } else if (ar == 45 || !position.r) {
      direction = 's';
    } else {
      direction = 'h';
    }

    // Adjust direction
    gfx.sx = position.r < 0 ? -1 : 1;

    // Play animation
    gfx.play(((motion.dx || motion.dy) ? '' : '_') + direction);
  }
});
