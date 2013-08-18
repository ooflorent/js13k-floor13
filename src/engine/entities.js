(function (engine) {
  'use strict';

  var currentId = 0;
  var entities = {};
  var entitiesToComponents = {};
  var componentsToEntities = {};

  /**
   * Computes the intersection of two arrays.
   *
   * @param {array} The array with master values to check
   * @param {array} An array to compare values against
   * @return {array}
   */
  var intersect = function(a, b) {
    var results = [];

    var i = 0;
    var n = a.length;

    for (; i < n; i++) {
      if (b.indexOf(a[i]) >= 0) {
        results.push(a[i]);
      }
    }

    return results;
  };

  /**
   * Manage entities.
   */
  var EntityManager = {
    /**
     * Create a new entity.
     *
     * @param {String} tag
     * @return {int} entity
     */
    create: function(name) {
      var id = currentId++;
      var tag = '$' + (name || id);

      entities[id] = tag;
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
        EntityManager.remove(entity, component);
      }

      delete entities[id];
    },
    /**
     * Add a component to the specified entity.
     *
     * @param {int} entity
     * @param {Object} component
     * @param {String} component name
     */
    add: function(entity, component, name) {
      entitiesToComponents[entity][name] = component;

      if (!componentsToEntities[name]) {
        componentsToEntities[name] = [];
      }

      componentsToEntities[name][entity] = true;
    },
    /**
     * Remove a component from the specified entity.
     *
     * @param {int} entity
     * @param {String} component name
     */
    remove: function(entity, name) {
      delete entitiesToComponents[entity][name];
      delete componentsToEntities[name][entity];
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
     * Get entities with specified components.
     *
     * @return {int[]} entities
     */
    filter: function() {
      var entities = Object.keys(componentsToEntities[arguments[0]] || {});

      for (var i = 0; i < arguments.length; i++) {
        entities = intersect(entities, Object.keys(componentsToEntities[arguments[i]] || {}));
      }

      return entities;
    }
  };

  engine.EntityManager = EntityManager;

})(engine);
