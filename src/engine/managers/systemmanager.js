/**
 * Manage game systems.
 *
 * @param  {EventManager} eventManager
 */
function SystemManager(eventManager) {
  // Private fields
  var systems = [];
  var systemsCount = 0;

  // Shortcuts
  var cancelAnimationFrame = window.cancelAnimationFrame;
  var requestAnimationFrame = window.requestAnimationFrame;

  // Methods variables
  var system, i;

  /**
   * @private
   * @param  {Entity} entity
   */
  function onComponentAdded(entity) {
    for (i = systemsCount; i--;) {
      if ((system = systems[i]) && !system.h(entity) && entity.m.apply(null, system.t)) {
        system.e[entity.i] = entity;
        system.a(entity);
      }
    }
  }

  /**
   * @private
   * @param  {Entity} entity
   */
  function onComponentRemoved(entity, type, component) {
    for (i = systemsCount; i--;) {
      if ((system = systems[i]) && system.h(entity) && system.t.indexOf(component.constructor) >= 0) {
        delete system.e[entity.i];
        system.r(entity);
      }
    }
  }

  // Listen EntityManager events
  eventManager.a('$a', onComponentAdded);
  eventManager.a('$r', onComponentRemoved);

  __mixin(this, {
    /**
     * Register a new game system.
     *
     * @param  {System} system
     */
    a: function add(system) {
      systems[system.i = systemsCount++] = system;
    },
    /**
     * Process tick.
     *
     * @param  {float} elapsed
     */
    u: function update(elapsed) {
      for (i = 0; i < systemsCount; i++) {
        systems[i].u(elapsed);
      }
    },
    /**
     * Remove all systems.
     */
    c: function clear() {
      // Remove EntityManager listeners
      eventManager.r('$a', onComponentAdded, this);
      eventManager.r('$a', onComponentRemoved, this);

      // Clear all systems
      systems.length = systemsCount = 0;
    }
  });
}

/**
 * Basic game system.
 *
 * @param  {...} components
 */
function System() {
  this.t = argumentsToArray(arguments);
  this.e = [];
}

__define(System, {
  /**
   * @param  {int} entity
   * @return {Boolean}
   */
  h: function has(entity) {
    return !!this.e[entity.i];
  },
  /**
   * Called when a new entity is added to the system.
   * @param  {int} entity
   */
  a: function onEntityAdded(entity) {},
  /**
   * Called when an entity is removed from the system.
   * @param  {int} entity
   */
  r: function onEntityRemoved(entity) {},
  /**
   * Process tick.
   *
   * @param  {float} elapsed
   */
  u: function update(elapsed) {}
});

/**
 * @param  {String[]} components
 */
function IteratingSystem() {
  System.apply(this, argumentsToArray(arguments));
}

__extend(IteratingSystem, System, {
  /**
   * Process tick with an entity.
   *
   * @param  {Entity} entity
   * @param  {float} elapsed
   */
  ue: function updateEntity(entity, elapsed) {},
  /**
   * Process tick.
   *
   * @param  {float} elapsed
   */
  u: function update(elapsed) {
    var entities = this.e, i;
    for (i in entities) {
      this.ue(entities[i], elapsed);
    }
  }
});
