(function (engine, document) {
  'use strict';

  var capture = [];
  var active = {};

  /**
   * Manage keyboard events.
   */
  var Input = {
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
    var key = e.keyCode;
    if (capture.indexOf(key) >= 0) {
      e.preventDefault();
    }

    active[key] = true;
  });

  // Listen `keyup` events
  addDocumentListener('keyup', function(e) {
    var key = e.keyCode;
    if (capture.indexOf(key) >= 0) {
      e.preventDefault();
    }

    active[key] = false;
  });

  engine.Input = Input;

})(engine, document);
