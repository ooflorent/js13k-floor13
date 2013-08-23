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
    document.addEventListener(name, listener, false);
  }

  // Listen `keypress` events
  addDocumentListener('keypress', function(e) {
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
