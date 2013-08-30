function CameraSystem(layer) {
  System.call(this);
  this.l = layer;
}

__extend(CameraSystem, System, {
  update: function(elapsed) {
    var position = Pixelwars.c(Pixelwars.t('p'), Position.name);
    var map = Pixelwars.c(Pixelwars.t('d'), Display.name).gfx.texture.frame;

    var renderer = Buffer.renderer;
    var camera = this.l;

    camera.x = -clamp(position.x - renderer.w / 2 | 0, 0, map.w - renderer.w);
    camera.y = -clamp(position.y - renderer.h / 2 | 0, 0, map.h - renderer.h);
  }
});
