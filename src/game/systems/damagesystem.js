function DamageSystem() {
  System.call(this, Health);

  __evt.a(EVENT_HIT, function(entity, position, damage) {
    if (this.h(entity)) {
      var health = entity.g(Health);
      var i;

      // Generate gibs
      for (i = damage * 2 + getRandomInt(4, 9); i--;) {
        EntityCreator.gib(position, getRandomElement(health.c), 1.0);
      }

      // Kill the entity
      if ((health.h -= damage) <= 0) {
        // Generate more gibs!
        for (i = getRandomInt(20, 30); i--;) {
          EntityCreator.gib(position, getRandomElement(health.c), 1.5);
        }

        __em.k(entity);
      }
    }
  }, this);
}

__extend(DamageSystem, System);
