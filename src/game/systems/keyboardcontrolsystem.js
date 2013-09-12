/**
 * Control player.
 */
function KeyboardControlSystem() {
  System.call(this);
  Input.c([37, 38, 39, 40]);
}

__extend(KeyboardControlSystem, System, {
  u: function update() {
    var x = y = 0;

    var player = __tm.g(TAG_PLAYER);
    var position = player.g(Position);
    var motion = player.g(Motion);
    var state = player.g(State);
    var cooldown = player.g(Cooldown);
    var weapon = player.g(Weapon);

    // Reset movement
    motion.dx = motion.dy = 0;
    state.s = STATE_IDLE;

    if (cooldown.g('atk')) {
      state.s = STATE_ATTACK;
    } else {
      if (!cooldown.g('reload')) {
        // Keypress is allowed only if the weapon has a full auto mode
        if (weapon.fa && Input.p(88) || Input.j(88)) { // X
          // Shoot if the weapon has enough bullets
          if (weapon.c()) {
            weapon.s();
            cooldown.s('atk', weapon.fr);
            EntityCreator.bullet(position, weapon);
          }
        } else if (Input.j(67)) { // C
          // Reload weapon
          weapon.r();
          cooldown.s('reload', weapon.rt);
        }
      }

      if (Input.j(86)) { // V
        var loots = __gm.g(GROUP_LOOTS), loot;
        for (var i = loots.length; i--;) {
          loot = loots[i];
          if (loot.g(Bounds).o(player.g(Bounds))) {
            player.r(Weapon);
            player.a(loot.g(Weapon));
            loot.r(Weapon);
            loot.a(weapon);
          }
        }
      }

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

    // Update keyboard controller
    Input.u();
  }
});
