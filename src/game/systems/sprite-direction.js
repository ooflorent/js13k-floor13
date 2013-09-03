function SpriteDirectionSystem(layer) {
  IteratingSystem.call(this, [Position.name, Motion.name, Display.name]);
  this.l = layer;
}

__extend(SpriteDirectionSystem, IteratingSystem, {
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var motion = Pixelwars.c(entity, Motion.name);
    var gfx = Pixelwars.c(entity, Display.name).gfx;

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
