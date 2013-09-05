function Ticker() {
  // Private variables
  var requestID = 0;

  // Methods variables
  var time, update;

  __mixin(this, {
    /**
     * Start the game loop.
     */
    start: function start(callback, context) {
      if (!requestID) {
        time = +new Date();
        requestID = requestAnimationFrame(update = function() {
          callback.call(context, -(time - (time = +new Date())) / 1000);
          requestID = requestAnimationFrame(update);
        });
      }
    },
    /**
     * Stop the game loop.
     */
    stop: function stop() {
      if (requestID) {
        cancelAnimationFrame(requestID);
        requestID = 0;
      }
    },
  });
}
