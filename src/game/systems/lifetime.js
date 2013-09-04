function LifetimeSystem() {
  IteratingSystem.call(this, [Lifetime.name]);
}

__extend(LifetimeSystem, IteratingSystem, {
  onUpdate: function(entity, elapsed) {
    var lifetime = Pixelwars.c(entity, Lifetime.name);
    if ((lifetime.t -= elapsed) <= 0) {
      EntityManager.kill(entity);
    }
  }
});
