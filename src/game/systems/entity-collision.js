function EntityCollisionSystem() {
  System.call(this);
}

__extend(EntityCollisionSystem, System, {
  update: function(elapsed) {
    var entities = EntityManager.filter([Position.name, Bounds.name]);
    var n = entities.length, i, j;
    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        var e1 = entities[i];
        var e2 = entities[j];

        var p1 = Pixelwars.c(e1, Position.name);
        var p2 = Pixelwars.c(e2, Position.name);
        var b1 = Pixelwars.c(e1, Bounds.name);
        var b2 = Pixelwars.c(e2, Bounds.name);

        var r1 = new Rectangle((p1.x | 0) + b1.x, (p1.y | 0) + b1.y, b1.w, b1.h);
        var r2 = new Rectangle((p2.x | 0) + b2.x, (p2.y | 0) + b2.y, b2.w, b2.h);

        if (r1.overlap(r2)) {
          var m1 = Pixelwars.c(e1, Motion.name);
          if (m1) {
            p1.x -= elapsed * m1.dx;
            p1.y -= elapsed * m1.dy;
          }
        }
      }
    }
  }
});
