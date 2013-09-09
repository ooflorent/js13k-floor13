function KeyboardControlSystem() {
  System.call(this);
  Input.c([37, 38, 39, 40]);
}

__extend(KeyboardControlSystem, System, {
  u: function update(elapsed) {
    var x = y = 0;

    var player = __tm.g(TAG_PLAYER);
    var position = player.g(Position);
    var motion = player.g(Motion);
    var state = player.g(State);
    var cooldown = player.g(Cooldown);

    // Reset movement
    motion.dx = motion.dy = 0;
    state.s = STATE_IDLE;

    if (!cooldown.g('atk')) {
      if (Input.j(88)) { // X
        EntityCreator.bullet(position);
        cooldown.s('atk', 0.2);
      } else if (Input.j(67)) { // V
        var dash = EntityCreator.dash(position);
        cooldown.s('atk', 0.5);
      } else {
        if (Input.p(37)) { // LEFT
          x = -1;
        } else if (Input.p(39)) { // RIGHT
          x = 1;
        }

        if (Input.p(38)) { // UP
          y = -1;
        } else if (Input.p(40)) { // DOWN
          y = 1;
        }

        // Compute movement speed
        var length = Math.sqrt(x * x + y * y);
        if (length) {
          motion.dx = x / length * 60;
          motion.dy = y / length * 60;
          state.s = STATE_WALK;
        }
      }
    } else {
      state.s = STATE_ATTACK;
    }

    // Update keyboard controller
    Input.u();
  }
});
