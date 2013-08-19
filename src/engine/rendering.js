(function (engine, document) {
  'use strict';

  // Renderer
  // --------

  function Renderer(width, height, canvas) {
    this.ctx = canvas.getContext("2d");
    this.w = canvas.width = width;
    this.h = canvas.height = height;
  }

  Renderer.prototype.constructor = Renderer;

  Renderer.prototype.render = function(stage) {
    stage._update();

    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1);
    ctx.clearRect(0, 0, this.w, this.h);

    this._renderObject(stage);
  };

  Renderer.prototype._renderObject = function(object) {
    if (!object.visible || object._alpha === 0) {
      return;
    }

    if (object instanceof DisplayObjectContainer) {
      var children = object.children;
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

  Renderer.prototype._renderGraphics = function(graphics) {
  };

  // DisplayObject
  // -------------

  function DisplayObject() {
    this.x = 0;
    this.y = 0;
    this.alpha = 1;
    this.visible = true;
    this.parent = null;

    this._x = 0;
    this._y = 0;
    this._alpha = 1;
  }

  DisplayObject.prototype.constructor = DisplayObject;

  DisplayObject.prototype._update = function() {
    var parent = this.parent;

    // Calculate effective position
    this._x = parent._x + this.x;
    this._y = parent._y + this.y;

    // Calculate effective alpha
    this._alpha = this.alpha * parent._alpha;
  };

  // DisplayObjectContainer
  // ----------------------

  function DisplayObjectContainer() {
    DisplayObject.call(this);
    this.children = [];
  }

  DisplayObjectContainer.prototype = Object.create(DisplayObject.prototype);
  DisplayObjectContainer.prototype.constructor = DisplayObjectContainer;

  DisplayObjectContainer.prototype.add = function(child) {
    if (child.parent !== null) {
      child.parent.removeChild(child);
    }

    this.children.push(child);
    child.parent = this;
  };

  DisplayObjectContainer.prototype.remove = function(child) {
    var i = this.children.indexOf(child);
    if (i >= 0) {
      this.children.splice(i, 1);
      child.parent = null;
    }
  };

  DisplayObjectContainer.prototype._update = function() {
    if (!this.visible) {
      return;
    }

    DisplayObject._update.call(this);

    var children = this.children;
    var i = 0;
    var n = children.length;

    for (; i < n; i++) {
      children[i]._update();
    }
  };

  // Stage
  // -----

  function Stage() {
    DisplayObjectContainer.call(this);
  }

  Stage.prototype = Object.create(DisplayObjectContainer.prototype);
  Stage.prototype.constructor = Stage;

  Stage.prototype._update = function() {
    var children = this.children;
    var i = 0;
    var n = children.length;

    for (; i < n; i++) {
      children[i]._update();
    }
  };

  // exports
  // -------

  engine.Renderer = Renderer;
  engine.DisplayObject = DisplayObject;
  engine.DisplayObjectContainer = DisplayObjectContainer;
  engine.Stage = Stage;

})(engine, document);
