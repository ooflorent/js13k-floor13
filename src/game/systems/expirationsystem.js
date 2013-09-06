function ExpirationSystem() {
  IteratingSystem.call(this, Lifetime);
}

__extend(ExpirationSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var lifetime = entity.g(Lifetime);

    // Kill expired entities
    if ((lifetime.t -= elapsed) <= 0) {
      __em.k(entity);
    }
  }
});
