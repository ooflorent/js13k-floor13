function BulletSystem() {
  IteratingSystem.call(this, Bounds);
}

__extend(BulletSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var bounds = entity.g(Bounds);
    var i;

    // Doors collisions
    var bullets = __gm.g(GROUP_BULLETS);
    var bullet;
    for (i = bullets.length; i--;) {
      bullet = bullets[i];
      if (bullet != entity && bullet.g(Bounds).o(bounds)) {
        __evt.e(EVENT_HIT, entity, bullet.g(Position), 1);
        __em.k(bullet);
      }
    }
  }
});
