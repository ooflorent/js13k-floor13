var SystemManager = (function(window) {
  var systems = [];
  var requestID = -1;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  return {
    register: function(system) {
      systems.unshift(system);
    },
    init: function() {
      var i = systems.length;
      while (i--) {
        systems[i].init();
      }
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
      var i = systems.length;
      while (i--) {
        systems[i].update(elapsed);
      }
    }
  };
})(window);

var System = (function() {
  function createMatcher(components, callback) {
    return function(entity) {
      if (EntityManager.match(entity, components)) {
        callback(entity);
      }
    };
  }

  function System(components) {
    this.c = components;
    EventManager.add('componentAdded', createMatcher(components, this.add));
    EventManager.add('componentRemoved', createMatcher(components, this.remove));
  }

  define(System.prototype, {
    init: function() {},
    add: function(entity) {},
    remove: function(entity) {},
    update: function(elapsed) {}
  });

  return System;
})();

var IteratingSystem = (function(_super) {
  function IteratingSystem(components) {
    _super.call(this, components);
  }

  extend(IteratingSystem, System);
  define(IteratingSystem.prototype, {
    onUpdate: function(entity, elapsed) {},
    update: function(elapsed) {
      var onUpdate = this.onUpdate;
      var entities = EntityManager.filter(this.c);
      var i = entities.length;

      while (i--) {
        onUpdate.call(this, entities[i], elapsed);
      }
    }
  });

  return IteratingSystem;
})(System);
