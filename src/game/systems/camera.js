function CameraSystem(layer) {
  System.call(this);
  this.l = layer;
}

__extend(CameraSystem, System, {
  u: function update(elapsed) {
    var position = _em.f([Player])[0].g(Position);
    var map = _em.f([World])[0].g(Display).gfx.texture.frame;

    var renderer = Buffer.renderer;
    var camera = this.l;

    camera.x = -clamp(position.x - renderer.w / 2 | 0, 0, map.w - renderer.w);
    camera.y = -clamp(position.y - renderer.h / 2 | 0, 0, map.h - renderer.h);
  }
});
