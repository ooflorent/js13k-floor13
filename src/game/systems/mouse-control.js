function MouseControlSystem() {
  System.call(this);

  // Listen click events
  EventManager.on('click', function(pt) {
    var camera = Pixelwars.c(Pixelwars.t('g'), Camera.name);
    var player = Pixelwars.t('p');

    Pixelwars.a(player, new Direction(pt.x - camera.l.x, pt.y - camera.l.y));
  });
}

__extend(MouseControlSystem, System);
