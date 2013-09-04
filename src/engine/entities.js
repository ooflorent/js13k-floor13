/**
 * Manage entities.
 */
function EntityManager() {
  // Private fields
  var currentId = 0;
  var entitiesToComponents = [];
  var componentsToEntities = {};

  // Methods variables
  var entity, components,component, types, type;

  /**
   * @param {Function[]} ctors Component constructors
   * @return {String[]} Component names
   */
  function componentsToTypes(ctors) {
    return ctors.map(function(ctor) {
      return ctor.name;
    });
  }

  __mixin(this, {
    /**
     * Create a new entity.
     *
     * @param {Object[]} components
     * @return {Entity} entity
     */
    e: function create(comps) {
      entities[currentId] = entity = new Entity(currentId++);
      comps && comps.map(entity.add, entity);
      return entity;
    },
    /**
     * Kill the specified entity.
     *
     * @param {Entity} entity
     */
    k: function kill(entity) {
      entity.clear();
      delete entitiesToComponents[entity.i];
    },
    /**
     * Get entities with specified components.
     *
     * @param {Function[]} ctors Component constructors
     * @return {int[]} entities
     */
    f: function filter(ctors) {
      entities = Object.keys(entitiesToComponents);
      for (types = componentsToTypes(ctors), i = types.length; i--;) {
        entities = intersect(entities, Object.keys(componentsToEntities[components[i]] || {}));
      }
      return entities;
    },
    /**
     * Unregister all entities.
     * Warning: Entities are not killed.
     */
    c: function clear() {
      entities = [];
      currentId = 0;
    }
  });

  function Entity(id) {
    this.i = id;
    __mixin(this, {
      /**
       * Add a component to the entity.
       *
       * @param {Object} component
       */
      a: function add(component) {
        entitiesToComponents[id][type = component.constructor.name] = component;
        componentsToEntities[type] || (componentsToEntities[type] = []);
        componentsToEntities[type][id] = 1;
        EventManager.emit('ca', this, component);
      },
      /**
       * Remove a component from the entity.
       *
       * @param {Function} ctor Component constructor
       */
      r: function remove(ctor) {
        component = entitiesToComponents[id][type = ctor.name];
        delete entitiesToComponents[entity][type];
        delete componentsToEntities[type][entity];
        EventManager.emit('cr', this, component);
      },
      /**
       * Get a component from the entity.
       *
       * @param {Function} ctor Component constructor
       * @return {Object} component
       */
      g: function get(ctor) {
        return entitiesToComponents[id][ctor.name];
      },
      /**
       * Check if the entity matches the given components.
       *
       * @param {Function[]} ctors Component constructors
       * @return {Boolean}
       */
      m: function match(ctors) {
        types = componentsToTypes(ctors);
        return intersect(Object.keys(entitiesToComponents[id]), types).length == types.length;
      },
      /**
       * Remove all the components of the entity.
       */
      c: function clear() {
        for (type in entitiesToComponents[id]) {
          this.remove(type);
        }
      }
    });
  }
}
