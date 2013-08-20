(function (engine) {
  'use strict';

  // Renderer
  // --------

  function Renderer(width, height, canvas) {
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width = width;
    this.h = canvas.height = height;
  }

  var RendererPrototype = Renderer.prototype;
  RendererPrototype.constructor = Renderer;

  RendererPrototype.render = function(stage) {
    stage._update();

    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    this._renderObject(stage);
  };

  RendererPrototype._renderObject = function(object) {
    if (!object.visible || !object._a) {
      return;
    }

    if (object instanceof DisplayContainer) {
      var children = object._c;
      var i = 0;
      var n = children.length;

      for (; i < n; i++) {
        this._renderObject(children[i]);
      }

      return;
    }

    var ctx = this.context;

    if (object instanceof Graphics) {
      ctx.setTransform(1, 0, 0, 1, object._x, object._y);
      this._renderGraphics(object);
      return;
    }
  };

  RendererPrototype._renderGraphics = function(graphics) {
  };

  // DisplayObject
  // -------------

  function DisplayObject() {
    this.x = 0;
    this.y = 0;
    this.alpha = 1;
    this.visible = true;

    this._x = 0;
    this._y = 0;
    this._a = 1;
    this._p = null;
  }

  var DisplayObjectPrototype = DisplayObject.prototype;
  DisplayObjectPrototype.constructor = DisplayObject;

  DisplayObjectPrototype._update = function() {
    var parent = this._p;

    // Calculate effective position
    this._x = parent._x + this.x;
    this._y = parent._y + this.y;

    // Calculate effective alpha
    this._a = this.alpha * parent._a;
  };

  // DisplayContainer
  // ----------------

  function DisplayContainer() {
    DisplayObject.call(this);
    this._c = [];
  }

  var DisplayContainerPrototype = DisplayContainer.prototype = Object.create(DisplayObjectPrototype);
  DisplayContainerPrototype.constructor = DisplayContainer;

  DisplayContainerPrototype.add = function(child) {
    if (child._p) {
      child._p.remove(child);
    }

    this._c.push(child);
    child._p = this;
  };

  DisplayContainerPrototype.remove = function(child) {
    var children = this._c;
    var i = children.indexOf(child);
    if (i >= 0) {
      children.splice(i, 1);
      child._p = null;
    }
  };

  DisplayContainerPrototype._update = function() {
    if (!this.visible || !this._a) {
      return;
    }

    DisplayObjectPrototype._update.call(this);

    var children = this._c;
    var i = children.length;

    for (; i--;) {
      children[i]._update();
    }
  };

  // Stage
  // -----

  function Stage() {
    DisplayContainer.call(this);
  }

  var StagePrototype = Stage.prototype = Object.create(DisplayContainerPrototype);
  StagePrototype.constructor = Stage;

  StagePrototype._update = function() {
    var children = this._c;
    var i = children.length;

    for (; i--;) {
      children[i]._update();
    }
  };

  // exports
  // -------

  engine.Renderer = Renderer;
  engine.DisplayObject = DisplayObject;
  engine.DisplayContainer = DisplayContainer;
  engine.Stage = Stage;

})(engine);
