function MousePlayerControlSystem() {
  System.call(this);
  EventManager.add('click', function(pos) {
    var camera = Pixelwars.c(Pixelwars.t('g'), Camera.name);
    console.log(pos, camera.l.x, camera.l.y);
  });
}

__extend(MousePlayerControlSystem, System, {
  update: function(elapsed) {
    /*
    var player = Pixelwars.t('p');
    var path = Pixelwars.c(player, Path.name);
    var map = Pixelwars.c(Pixelwars.t('p'), Dungeon.name);

    var position = Pixelwars.c(player, Position.name);
    var motion = Pixelwars.c(player, Motion.name);
    var gfx = Pixelwars.c(player, Display.name).gfx;

    if (!path) {
      Pixelwars.a(player, new Path())
    }

    var x = y = 0;
    if (Pixelwars.k(37)) { // LEFT
      x = -1;
    } else if (Pixelwars.k(39)) { // RIGHT
      x = 1;
    }

    if (Pixelwars.k(38)) { // UP
      y = -1;
    } else if (Pixelwars.k(40)) { // DOWN
      y = 1;
    }

    var length = Math.sqrt(x * x + y * y);
    if (length) {
      motion.dx = x / length * 60;
      motion.dy = y / length * 60;
      motion.dr = 180 * Math.atan2(motion.dx, motion.dy) / Math.PI;
      gfx.play(Position.d(motion.dr));
    } else {
      motion.dx = motion.dy = 0;
      gfx.play('_' + Position.d(motion.dr));
    }

    gfx.sx = motion.dr < 0 ? -1 : 1;
    */
  }
});
