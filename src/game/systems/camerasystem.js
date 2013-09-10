function CameraSystem(layer) {
  System.call(this);
  this.l = layer;
}

__extend(CameraSystem, System, {
  u: function update(elapsed) {
    var position = __tm.g(TAG_PLAYER).g(Position);
    var camera = this.l;

    camera.x = -clamp(position.x - __PW_GAME_WIDTH / 2 | 0, 0, __PW_WORLD_WIDTH * 16 - __PW_GAME_WIDTH);
    camera.y = -clamp(position.y - __PW_GAME_HEIGHT / 2 | 0, 0, __PW_WORLD_HEIGHT * 16 - __PW_GAME_HEIGHT);
  }
});
