function KeyboardPlayerControlSystem() {
  System.call(this);
  Input.keys([37, 38, 39, 40]);
}

__extend(KeyboardPlayerControlSystem, System, {
  update: function(elapsed) {
    var getKey = Input.get;

    var player = Pixelwars.t('p');
    var motion = Pixelwars.c(player, Motion.name);
    var gfx = Pixelwars.c(player, Display.name).gfx;

    var x = y = 0;
    if (getKey(37)) { // LEFT
      x = -1;
    } else if (getKey(39)) { // RIGHT
      x = 1;
    }

    if (getKey(38)) { // UP
      y = -1;
    } else if (getKey(40)) { // DOWN
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
  }
});
