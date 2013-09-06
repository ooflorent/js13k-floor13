/**
 * Manage entity groups.
 *
 * @param  {EventManager} eventManager
 */
function GroupManager(eventManager) {
  // Private variables
  var entitiesByGroup = {};

  // Methods variables
  var group, i;

  eventManager.a('$k', function onEntityKilled(entity) {
    for (group in entitiesByGroup) {
      ~(i = entitiesByGroup[group].indexOf(entity)) && entitiesByGroup[group].splice(i, 1);
    }
  });

  __mixin(this, {
    /**
     * Add an entity to the specified group.
     *
     * @param  {String} group
     * @param  {Entity} entity
     */
    a: function add(group, entity) {
      entitiesByGroup[group] || (entitiesByGroup[group] = []);
      entitiesByGroup[group].push(entity);
    },
    /**
     * Retrieve all entities of the specified group.
     *
     * @param  {String} group
     */
    g: function get(group) {
      return (entitiesByGroup[group] || []).slice();
    },
    /**
     * Unregister all groups.
     */
    c: function clear() {
      entitiesByGroup = {};
    }
  });
}
