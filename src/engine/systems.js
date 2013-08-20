(function(engine, window) {
  'use strict';

  var EntityManager = engine.EntityManager;
  var EventManager = engine.EventManager;

  var systems = [];
  var requestID = -1;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  function createMatcher(components, callback) {
    return function(entity) {
      if (EntityManager.match(entity, components)) {
        callback(entity);
      }
    };
  }

  var SystemManager = {
    register: function(system) {
      systems.push(system);
    },
    start: function() {
      if (requestID == -1) {
        var previousTime = +new Date();
        var update = function(timestamp) {
          var tmp = previousTime;
          previousTime = +new Date();
          SystemManager.update((previousTime - tmp) / 1000);
          requestID = requestAnimationFrame(update);
        };

        requestID = requestAnimationFrame(update);
      }
    },
    stop: function() {
      if (requestID != -1) {
        cancelAnimationFrame(requestID);
        requestID = -1;
      }
    },
    update: function(elapsed) {
      var i = 0;
      var n = systems.length;

      for (; i < n; i++) {
        systems[i].update(elapsed);
      }
    }
  };

  function System(components) {
    this.add = function(entity) {};
    this.remove = function(entity) {};
    this.update = function(elapsed) {};

    EventManager.add('componentAdded', createMatcher(components, this.add));
    EventManager.add('componentRemoved', createMatcher(components, this.remove));
  }

  function IteratingSystem(components, onUpdate) {
    System.call(this, components);

    this.update = function(elapsed) {
      var entities = EntityManager.filter(components);
      var i = entities.length;

      for (; i--;) {
        onUpdate(entities[i], elapsed);
      }
    };
  }

  engine.SystemManager = SystemManager;
  engine.System = System;
  engine.IteratingSystem = IteratingSystem;

})(engine, window);
