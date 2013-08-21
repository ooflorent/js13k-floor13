(function (engine) {
  'use strict';

  function setPixel(image, x, y, color) {
    var i = (x + y * image.width) * 4;
    var data = image.data;

    data[i]     = 0xFF & (color >> 16);
    data[i + 1] = 0xFF & (color >> 8);
    data[i + 2] = 0xFF & (color);
    data[i + 3] = 0xFF & (color >> 24);
  }

  // Buffer
  // ------

  function Buffer(width, height, scale, canvas) {
    var rendererCanvas = document.createElement('canvas');
    var renderer = new Renderer(width, height, rendererCanvas);

    var w = canvas.width = width * scale;
    var h = canvas.height = height * scale;

    var ctx = canvas.getContext('2d');

    var patternCanvas = document.createElement('canvas');

    patternCanvas.width = patternCanvas.height = scale;
    var patternCtx = patternCanvas.getContext('2d');
    var patternData = patternCtx.createImageData(scale, scale);

    var i;
    var n = scale - 1;

    setPixel(patternData, 0, 0, 0x33FFFFFF);
    setPixel(patternData, n, n, 0x33000000);

    for (i = 0; i < n; i++) {
      setPixel(patternData, i, 0, 0x33E0E0E0);
      setPixel(patternData, i, n, 0x33000000);
    }

    for (i = 0; i < n; i++) {
      setPixel(patternData, 0, i, 0x33FFFFFF);
      setPixel(patternData, n, i, 0x33000000);
    }

    patternCtx.putImageData(patternData, 0, 0);

    var pattern = ctx.createPattern(patternCanvas, 'repeat');

    this.render = function(stage) {
      renderer.render(stage);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(rendererCanvas, 0, 0, w, h);
      ctx.rect(0, 0, w, h);
      ctx.fillStyle = pattern;
      ctx.fill();
    };
  }

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
      var i = children.length;

      while (i--) {
        this._renderObject(children[i]);
      }

      return;
    }

    if (object instanceof Graphics) {
      this.ctx.setTransform(1, 0, 0, 1, object._x, object._y);
      this._renderGraphics(object);
      return;
    }
  };

  RendererPrototype._renderGraphics = function(graphics) {
    var ctx = this.ctx;

    ctx.fillStyle = graphics._f;
    ctx.strokeStyle = graphics._s;

    graphics._b(this.ctx);
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

  // Graphics
  // --------

  function Graphics(batch, fill, stroke) {
    DisplayObject.call(this);
    this._f = fill;
    this._s = stroke;
    this._b = batch;
  }

  var GraphicsPrototype = Graphics.prototype = Object.create(DisplayObjectPrototype);
  GraphicsPrototype.constructor = Graphics;

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

    while (i--) {
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

    while (i--) {
      children[i]._update();
    }
  };

  // exports
  // -------

  engine.Buffer = Buffer;
  engine.Renderer = Renderer;
  engine.DisplayObject = DisplayObject;
  engine.DisplayContainer = DisplayContainer;
  engine.Graphics = Graphics;
  engine.Stage = Stage;

})(engine);
