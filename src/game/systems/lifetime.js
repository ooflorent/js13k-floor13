function LifetimeSystem() {
  IteratingSystem.call(this, [Lifetime]);
}

__extend(LifetimeSystem, IteratingSystem, {
  ue: function(entity, elapsed) {
    var lifetime = entity.g(Lifetime);
    if ((lifetime.t -= elapsed) <= 0) {
      EntityManager.kill(entity);
    }
  }
});
