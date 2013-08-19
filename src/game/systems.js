(function (game, engine) {
  'use strict';

  var EntityManager = engine.EntityManager;
  var EventManager = engine.EventManager;
  var Position = game.Position;
  var Motion = game.Motion;
  var Display = game.Display;

  game.MovementSystem = function() {
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
  };

  game.RenderingSystem = function(canvas) {
    var renderer = new engine.Renderer(960, 720, canvas);
    var stage = new engine.Stage();
    var previousEntities = [];

    EventManager.add('componentAdded', function(entity, name, component) {
      if (name === Display.name) {
        stage.add(component.gfx);
      }
    });

    EventManager.add('componentRemoved', function(entity, name, component) {
      if (name === Display.name) {
        stage.remove(component.gfx);
      }
    });

    this.update = function(elapsed) {
      renderer.render(stage);
    };
  };

})(game, engine);
