var EventManager = (function () {
  var handlers = {}, i, list, args, A = Array;
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
     * @param  {String} type
     * @param  {Function} func
     * @param  {Object} ctx
     */
    on: function(type, func, ctx) {
      handlers[type] || (handlers[type] = []);
      handlers[type].push({f: func, c: ctx});
    },
    /**
     * Remove an event handler.
     *
     * @param  {String} type
     * @param  {Function} func
     */
    off: function(type, func) {
      list = handlers[type] || [];
      i = list.length;

      while (~--i < 0) {
        func == list[i].f && list.splice(i, 1);
      }
    },
    /**
     * Emit an event.
     */
    emit: function() {
      args = A.apply([], arguments);
      list = handlers[args.shift()] || [];
      i = list.length;

      while (~--i < 0) {
        list[i].f.apply(list[i].c, args);
      }
    }
  };
})();
