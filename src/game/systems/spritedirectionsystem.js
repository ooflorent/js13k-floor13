function SpriteDirectionSystem(layer) {
  IteratingSystem.call(this, Position, State, Display);
  this.l = layer;
}

__extend(SpriteDirectionSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var state = entity.g(State);
    var gfx = entity.g(Display).gfx;

    // Adjust direction
    gfx.sx = position.r < 0 ? -1 : 1;

    // Compute animation direction
    var direction;
    var ar = Math.abs(position.r);
    if (ar == 135 || position.r == 180) {
      direction = 'n';
    } else if (ar == 45 || !position.r) {
      direction = 's';
    } else {
      direction = 'h';
    }

    // Adjust animation
    gfx.play(state.s + direction);
  }
});
