function AISystem() {
  IteratingSystem.call(this, Position, Brain, Cooldown);
}

__extend(AISystem, IteratingSystem, {
  ue: function update(entity, elapsed) {
    var brain = entity.g(Brain);
    var cooldown = entity.g(Cooldown);
    var position = entity.g(Position).g();
    var playerPosition = __tm.g(TAG_PLAYER).g(Position).g();

    if (brain.a) {
      if (!cooldown.g('think')) {
        cooldown.s('think', 0.2);
        brain.p = AStar.s(position, playerPosition);
      }
    } else {
      AStar.r(position, playerPosition) && (brain.a = true);
    }
  }
});
