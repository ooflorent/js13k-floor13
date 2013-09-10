function AISystem() {
  IteratingSystem.call(this, Position, Brain, Cooldown);
}

__extend(AISystem, IteratingSystem, {
  ue: function update(entity, elapsed) {
    var brain = entity.g(Brain);
    var cooldown = entity.g(Cooldown);
    var position = entity.g(Position).g();
    var playerPosition = __tm.g(TAG_PLAYER).g(Position).g();

    var seePlayer = AStar.r(position, playerPosition);

    // Check if the enemy brain is active
    if (brain.a) {
      if (!cooldown.g('react')) {
        if (seePlayer) {
          // Stop chasing the player
          brain.p = [];

          // Shoot him
        } else {
          // Chase the player
          brain.p = AStar.s(position, playerPosition);
        }

        // Delay next decision
        cooldown.s('react', 0.2);
      }
    } else {
      if (seePlayer) {
        // Active the entity brain
        brain.a = true;

        // Add reaction cooldown
        cooldown.s('react', 0.2);
      }
    }
  }
});
