(function (engine) {
  'use strict';

  var handlers = {};

  var EventManager = {
    add: function(event, handler) {
      if (handlers[event]) {
        handlers[event].push(handler);
      } else {
        handlers[event] = [handler];
      }
    },
    remove: function(event, handler) {
      var h = handlers[event];
      h.splice(h.indexOf(handler), 1);
    },
    emit: function(event, a, b, c, d) {
      var h = handlers[event] || [];
      var i = 0;
      var n = h.length;

      for (; i < n; i++) {
        h[i](a, b, c, d);
      }
    }
  };

  engine.EventManager = EventManager;

})(engine);
