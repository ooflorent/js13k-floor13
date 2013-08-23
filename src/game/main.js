var Pixelwars = {
  e: EntityManager.create,
  c: EntityManager.get,
  k: Input.get,

  init: function(canvas) {
    SystemManager.register(new MovementSystem());
    SystemManager.register(new RenderingSystem(canvas));
  },
  run: function() {
    SystemManager.init();
    SystemManager.start();
  }
};
