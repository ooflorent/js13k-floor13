(function(engine, window) {
  'use strict';

  var systems = [];
  var requestID = -1;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var SystemManager = {
    register: function(system) {
      systems.push(system);
    },
    start: function() {
      if (requestID === -1) {
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
    stop: function() {
      if (requestID !== -1) {
        cancelAnimationFrame(requestID);
        requestID = -1;
      }
    },
    update: function(elapsed) {
      var i = 0;
      var n = systems.length;

      for (; i < n; i++) {
        systems[i].update(elapsed);
      }
    }
  };

  engine.SystemManager = SystemManager;

})(engine, window);
