(function(window, engine) {
  'use strict';

  var Input = engine.Input;
  var EventManager = engine.EventManager;
  var EntityManager = engine.EntityManager;
  var SystemManager = engine.SystemManager;

  window.game = {
    // Managers
    evt: EventManager,
    em: EntityManager,
    sm: SystemManager,

    // EntityManager shortcuts
    e: EntityManager.create,
    c: EntityManager.get,
    f: EntityManager.filter,
    m: EntityManager.match,

    // SystemManager shortcuts
    r: SystemManager.register,

    // Input shortcuts
    k: Input.get
  };

})(window, engine);
