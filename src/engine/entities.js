var EntityManager = (function () {
  var currentId = 0;
  var entitiesToTags = [];
  var tagsToEntities = {};
  var entitiesToComponents = [];
  var componentsToEntities = {};

  /**
   * Computes the intersection of two arrays.
   *
   * @param {array} The array with master values to check
   * @param {array} An array to compare values against
   * @return {array}
   */
  function intersect(a, b) {
    var results = [];

    for (var i = 0, n = a.length; i < n; i++) {
      if (b.indexOf(a[i]) >= 0) {
        results.push(a[i]);
      }
    }

    return results;
  }

  /**
   * Manage entities.
   */
  return {
    /**
     * Unregister all entities.
     */
    clear: function() {
      currentId = 0;
      entitiesToTags = [];
      tagsToEntities = {};
      entitiesToComponents = [];
      componentsToEntities = {};
    },
    /**
     * Create a new entity.
     *
     * @param {String} tag
     * @return {int} entity
     */
    create: function(name) {
      var id = currentId++;
      var tag = '$' + (name || id);

      entitiesToTags[id] = tag;
      tagsToEntities[tag] = id;

      entitiesToComponents[id] = {};

      return id;
    },
    /**
     * Kill the specified entity.
     *
     * @param {int} entity
     */
    kill: function(entity) {
      var components = Object.keys(entitiesToComponents[entity]);
      var component;
      for (component in components) {
        this.remove(entity, component);
      }

      var tag = entitiesToTags[entity];
      delete entitiesToTags[entity];
      delete tagsToEntities[tag];
    },
    /**
     * Add a component to the specified entity.
     *
     * @param {int} entity
     * @param {Object} component
     * @param {String} component name
     */
    add: function(entity, component, name) {
      if (!name) {
        name = component.constructor.name;
      }

      if (!componentsToEntities[name]) {
        componentsToEntities[name] = [];
      }

      componentsToEntities[name][entity] = true;
      entitiesToComponents[entity][name] = component;

      EventManager.emit('_ca', entity, component, name);
    },
    /**
     * Remove a component from the specified entity.
     *
     * @param {int} entity
     * @param {String} component name
     */
    remove: function(entity, name) {
      EventManager.emit('_cr', entity, entitiesToComponents[entity][name], name);

      delete entitiesToComponents[entity][name];
      delete componentsToEntities[name][entity];
    },
    /**
     * Get the entity with the specified tag.
     *
     * @param {String} entity tag
     * @return {int} int
     */
    tag: function(tag) {
      return tagsToEntities['$' + tag];
    },
    /**
     * Get a component from the specified entity.
     *
     * @param {int} entity
     * @param {String} component name
     * @return {Object} component
     */
    get: function(entity, name) {
      return entitiesToComponents[entity][name];
    },
    /**
     * Check if an entity matches the given components.
     *
     * @param {int} entity
     * @param {String} component name
     * @return {Boolean}
     */
    match: function(entity, components) {
      var i = components.length;
      while (i--) {
        if (!entitiesToComponents[entity][components[i]]) {
          return false;
        }
      }

      return true;
    },
    /**
     * Get entities with specified components.
     *
     * @param {String[]} components
     * @return {int[]} entities
     */
    filter: function(components) {
      var entities = Object.keys(componentsToEntities[components[0]] || {});
      for (var i = 1; i < components.length; i++) {
        entities = intersect(entities, Object.keys(componentsToEntities[components[i]] || {}));
      }

      return entities;
    }
  };
})();
