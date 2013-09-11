function BulletSystem() {
  IteratingSystem.call(this, Bounds);
}

__extend(BulletSystem, IteratingSystem, {
  u: function update(elapsed) {
    var map = __tm.g(TAG_WORLD).g(Dungeon);
    var bullets = __gm.g(GROUP_BULLETS);
    var bullet;
    for (i = bullets.length; i--;) {
      bullet = bullets[i];
      position = bullet.g(Position);

      if (isWall(map, position.x / 16 | 0, (position.y + 6) / 16 | 0)) {
        __em.k(bullet);
      }
    }

    IteratingSystem.prototype.u.call(this, elapsed);
  },
  ue: function updateEntity(entity, elapsed) {
    var bounds = entity.g(Bounds);
    var i;

    // Bullet collisions
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
