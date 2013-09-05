var Input = (function () {
  var capture = [];
  var active = [];

  // Variable methods
  var events, i, key;

  /**
   * Bind a listener on `document`.
   *
   * @param  {String} event name
   * @param  {Function} listener
   */
  function addDocumentListener(name, listener) {
    events = name.split(' ');
    for (i = events.length; i--;) {
      document.addEventListener(events[i], listener);
    }
  }

  // Listen `keypress` and `keydown` events
  addDocumentListener('keypress keydown', function(e) {
    (~capture.indexOf(key = e.keyCode)) && e.preventDefault();
    active[key] = 1;
  });

  // Listen `keyup` events
  addDocumentListener('keyup', function(e) {
    (~capture.indexOf(key = e.keyCode)) && e.preventDefault();
    active[key] = 0;
  });

  /**
   * Manage keyboard events.
   */
  return {
    /**
     * Specify keys to capture.
     * Capturing a key stops the default behavior.
     *
     * @param  {int[]} key codes
     */
    c: function setCapture(codes) {
      capture = codes;
    },
    /**
     * Get the state of the specified key.
     *
     * @param  {int} key code
     * @return {Boolean}
     */
    k: function key(code) {
      return !!active[code];
    }
  };
})();
