function CameraSystem() {
  System.call(this);
}

__extend(CameraSystem, System, {
  update: function(elapsed) {
    var position = Pixelwars.c(Pixelwars.t('p'), Position.name);
    var map = Pixelwars.c(Pixelwars.t('d'), Display.name).gfx.texture.frame;
    var renderer = Buffer.renderer;

    renderer.cx = clamp(position.x - renderer.w / 2 | 0, 0, map.w - renderer.w);
    renderer.cy = clamp(position.y - renderer.h / 2 | 0, 0, map.h - renderer.h);
  }
});
