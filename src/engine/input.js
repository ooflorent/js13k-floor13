var Input = (function () {
  var capture = [];
  var active = {};

  /**
   * Bind a listener on `document`.
   *
   * @param {String} event name
   * @param {Function} listener
   */
  function addDocumentListener(name, listener) {
    var events = name.split(' ');
    for (var i = events.length; i--;) {
      document.addEventListener(events[i], listener, false);
    }
  }

  // Listen `keypress` and `keydown` events
  addDocumentListener('keypress keydown', function(e) {
    if (capture.indexOf(e.keyCode) >= 0) {
      e.preventDefault();
    }

    active[e.keyCode] = true;
  });

  // Listen `keyup` events
  addDocumentListener('keyup', function(e) {
    if (capture.indexOf(e.keyCode) >= 0) {
      e.preventDefault();
    }

    active[e.keyCode] = false;
  });

  /**
   * Manage keyboard events.
   */
  return {
    /**
     * Specify keys to capture.
     * Capturing a key stops the default behavior.
     *
     * @param {int[]} key codes
     */
    keys: function(codes) {
      capture = codes;
    },
    /**
     * Get the state of the specified key.
     *
     * @param {int} key code
     * @return {Boolean}
     */
    get: function(code) {
      return !!active[code];
    }
  };
})();
