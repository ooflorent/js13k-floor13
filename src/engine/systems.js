var SystemManager = (function(window) {
  var systems = [];
  var requestID = -1;

  // Get the requestAnimationFrame() and cancelAnimationFrame()
  // for the current browser.
  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  /**
   * Manage game systems.
   */
  return {
    /**
     * Register a new game system.
     *
     * @param {System} system
     */
    register: function(system) {
      systems.unshift(system);
    },
    /**
     * Remove all systems.
     */
    clear: function() {
      while (systems.length) {
        systems.pop().clear();
      }
    },
    /**
     * Start the game loop.
     */
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
    /**
     * Stop the game loop.
     */
    stop: function() {
      if (requestID != -1) {
        cancelAnimationFrame(requestID);
        requestID = -1;
      }
    },
    /**
     * Process tick.
     *
     * @param {float} elapsed
     */
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

  /**
   * Basic game system.
   *
   * @param {string[]} components
   */
  function System(components) {
    this.c = components;

    if (components) {
      // Listen entities changes
      EventManager.add('_ca', this._ca = createMatcher(components, this.add));
      EventManager.add('_cr', this._cr = createMatcher(components, this.remove));
    }
  }

  define(System.prototype, {
    /**
     * Called by the SystemManager during the destruction.
     */
    clear: function() {
      EventManager.remove('_ca', this._ca);
      EventManager.remove('_cr', this._cr);
    },
    /**
     * Called when a new entity is added to the system.
     * @param {int} entity
     */
    add: function(entity) {},
    /**
     * Called when an entity is removed from the system.
     * @param {int} entity
     */
    remove: function(entity) {},
    /**
     * Process tick.
     *
     * @param {float} elapsed
     */
    update: function(elapsed) {}
  });

  return System;
})();

/**
 * @param {string[]} components
 */
function IteratingSystem(components) {
  System.call(this, components);
}

extend(IteratingSystem, System, {
  /**
   * Process tick with an entity.
   *
   * @param {int} entity
   * @param {float} elapsed
   */
  onUpdate: function(entity, elapsed) {},
  /**
   * Process tick.
   *
   * @param {float} elapsed
   */
  update: function(elapsed) {
    var onUpdate = this.onUpdate;
    var entities = EntityManager.filter(this.c);
    var i = entities.length;

    while (i--) {
      onUpdate.call(this, entities[i], elapsed);
    }
  }
});
