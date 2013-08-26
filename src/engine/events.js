var EventManager = (function () {
  var handlers = {};

  /**
   * Manage game events.
   */
  return {
    /**
     * Unregister all event listeners.
     */
    clear: function() {
      handlers = {};
    },
    /**
     * Add an event handler.
     *
     * @param  {String} event name
     * @param  {Function} handler
     */
    add: function(event, handler) {
      if (handlers[event]) {
        handlers[event].push(handler);
      } else {
        handlers[event] = [handler];
      }
    },
    /**
     * Remove an event handler.
     *
     * @param  {String} event name
     * @param  {Function} handler
     */
    remove: function(event, handler) {
      var h = handlers[event];
      var i = h.indexOf(handler);
      if (i >= 0) {
        h.splice(i, 1);
      }
    },
    /**
     * Emit an event.
     *
     * @param  {String} event
     * @param  {any} a
     * @param  {any} b
     * @param  {any} c
     * @param  {any} d
     */
    emit: function(event, a, b, c, d) {
      var h = handlers[event] || [];
      var i = 0;
      var n = h.length;

      for (; i < n; i++) {
        h[i](a, b, c, d);
      }
    }
  };
})();
