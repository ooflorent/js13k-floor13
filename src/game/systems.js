(function (game, engine) {
  'use strict';

  var EntityManager = engine.EntityManager;
  var Position = game.Position;
  var Motion = game.Motion;

  function MovementSystem() {
    this.update = function(elapsed) {
      var entities = EntityManager.filter(Position.name, Motion.name);
      var i = 0;
      var n = entities.length;

      for (; i < n; i++) {
        var position = EntityManager.get(entities[i], Position.name);
        var motion = EntityManager.get(entities[i], Motion.name);

        position.x = elapsed * motion.dx;
        position.y = elapsed * motion.dy;
      }
    };
  }

  game.MovementSystem = MovementSystem;

})(game, engine);
