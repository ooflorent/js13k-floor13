var SystemManager = (function() {
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
})();

/**
 * Basic game system.
 *
 * @param {string[]} components
 */
function System(components) {
  this.c = components;
  this.e = [];

  if (components) {
    this._ca = function(entity) {
      if (EntityManager.match(entity, components) && !this.has(entity)) {
        this.e.push(entity);
        this.add(entity);
      }
    };

    this._cr = function(entity, component) {
      var pos;
      if (components.indexOf(component) >= 0 && (pos = this.e.indexOf(entity)) >= 0) {
        this.e.splice(pos, 1);
        this.remove(entity);
      }
    };

    // Listen entities changes
    EventManager.on('_ca', this._ca, this);
    EventManager.on('_cr', this._cr, this);
  }
}

__define(System, {
  /**
   * Called by the SystemManager during the destruction.
   */
  clear: function() {
    EventManager.off('_ca', this._ca);
    EventManager.off('_cr', this._cr);
  },
  /**
   * @param {int} entity
   * @return {Boolean}
   */
  has: function(entity) {
    return this.e.indexOf(entity) >= 0;
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

/**
 * @param {string[]} components
 */
function IteratingSystem(components) {
  System.call(this, components);
}

__extend(IteratingSystem, System, {
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
    var entities = this.e;
    var i = entities.length;

    while (i--) {
      onUpdate.call(this, entities[i], elapsed);
    }
  }
});
