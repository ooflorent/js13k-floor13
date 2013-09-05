/**
 * Manage entity tags.
 *
 * @param  {EventManager} eventManager
 */
function TagManager(eventManager) {
  // Private variables
  var entityByTag = {};
  var tagByEntity = [];

  // Methods variables
  var tag;

  eventManager.a('$k', function onEntityKilled(entity) {
    if (tag = tagByEntity[entity.i]) {
      delete tagByEntity[entity.i];
      delete entityByTag[tag];
    }
  });

  __mixin(this, {
    /**
     * Tag an entity.
     *
     * @param  {Entity} entity
     * @param  {String} tag
     */
    r: function register(entity, tag) {
      entityByTag[tag] = entity;
      tagByEntity[entity.i] = tag;
    },
    /**
     * Retrieve an entity by its tag.
     *
     * @param  {String} tag
     */
    g: function get(tag) {
      return entityByTag[tag];
    },
    /**
     * Unregister all tags.
     */
    c: function clear() {
      entityByTag = {};
      tagByEntity = [];
    }
  });
}
