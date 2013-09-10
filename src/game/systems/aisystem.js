function AISystem() {
  IteratingSystem.call(this, Position, Brain, Cooldown);
}

__extend(AISystem, IteratingSystem, {
  ue: function update(entity, elapsed) {
    var brain = entity.g(Brain);
    var cooldown = entity.g(Cooldown);
    var position = entity.g(Position);
    var playerPosition = __tm.g(TAG_PLAYER).g(Position);

    var gridPosition = position.g();
    var playerGridPosition = playerPosition.g();
    var seePlayer = AStar.r(gridPosition, playerGridPosition);
    var delay, a, ra;

    // Check if the enemy brain is active
    if (brain.a) {
      if (seePlayer && !cooldown.g('atk') && (gridPosition.x == playerGridPosition.x || gridPosition.y == playerGridPosition.y)) {
          // Stop chasing the player
          brain.p = [];

          // Face him
          r = 180 * Math.atan2(playerPosition.x - position.x, playerPosition.y - position.y) / Math.PI;
          ra = Math.abs(r);
          position.r = ra > 135 ? 180 : (ra < 45 ? 0 : (r < 0 ? -90 : 90));

          // Shoot him
          EntityCreator.bullet(position);

          // Delay next shoot
          cooldown.s('atk', 0.3);
      } else {
        if (!cooldown.g('react')) {
          // Chase the player
          brain.p = AStar.s(gridPosition, playerGridPosition);

          // Delay next decision
          cooldown.s('react', 0.6);
        }
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
