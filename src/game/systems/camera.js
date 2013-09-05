function CameraSystem(layer) {
  System.call(this);
  this.l = layer;
}

__extend(CameraSystem, System, {
  u: function update(elapsed) {
    var position = __tm.g('p').g(Position);
    var map = __tm.g('w').g(Display).gfx.texture.frame;

    var renderer = Buffer.renderer;
    var camera = this.l;

    camera.x = -clamp(position.x - renderer.w / 2 | 0, 0, map.w - renderer.w);
    camera.y = -clamp(position.y - renderer.h / 2 | 0, 0, map.h - renderer.h);
  }
});
