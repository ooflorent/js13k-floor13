(function (engine) {
  'use strict';

  function createCanvas() {
    return document.createElement('canvas');
  }

  function toRGBA(color) {
    return {
      a: 0xFF & (color >> 24),
      r: 0xFF & (color >> 16),
      g: 0xFF & (color >> 8),
      b: 0xFF & (color)
    };
  }

  function setPixel(imageData, x, y, color) {
    var i = (x + y * imageData.width) * 4;
    var data = imageData.data;
    var rgba = toRGBA(color);

    data[i]     = rgba.r;
    data[i + 1] = rgba.g;
    data[i + 2] = rgba.b;
    data[i + 3] = rgba.a;
  }

  function blendOverlay(a, b) {
    if (a > 128) {
      return a - (255 - a) + b * (255 - a) / 128;
    } else {
      return b * a / 128;
    }
  }

  // Buffer
  // ------

  function Buffer(width, height, scale, canvas) {
    canvas.width = width * scale;
    canvas.height = height * scale;

    var ctx = this.ctx = canvas.getContext('2d');

    ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    this.rendererCanvas = createCanvas(canvas);
    this.renderer = new Renderer(width, height, this.rendererCanvas);
  }

  var BufferPrototype = Buffer.prototype;
  BufferPrototype.constructor = Buffer;

  Buffer.mosaic = function(scale) {
    var patternCanvas = createCanvas();
    var patternCtx = patternCanvas.getContext('2d');
    var patternData = patternCtx.createImageData(scale, scale);

    patternCanvas.width = patternCanvas.height = scale;

    var i;
    var n = scale - 1;

    setPixel(patternData, 0, 0, 0x33FFFFFF);
    setPixel(patternData, n, n, 0x33000000);

    for (i = 1; i < n; i++) {
      setPixel(patternData, i, 0, 0x33E0E0E0);
      setPixel(patternData, i, n, 0x33000000);
    }

    for (i = 1; i < n; i++) {
      setPixel(patternData, 0, i, 0x33FFFFFF);
      setPixel(patternData, n, i, 0x33000000);
    }

    return patternCanvas;
  };

  BufferPrototype.render = function(stage) {
    this.renderer.render(stage);
    this.ctx.drawImage(this.rendererCanvas, 0, 0);
  }

  // Renderer
  // --------

  function Renderer(width, height, canvas) {
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width = width;
    this.h = canvas.height = height;
    this.m = undefined;
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

    var ctx = this.ctx;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, object._x, object._y);
    ctx.globalAlpha = object._a;

    if (object instanceof Sprite) {
      ctx.drawImage(object._i, 0, 0);
    } else if (object instanceof Graphics) {
      ctx.fillStyle = object._f;
      ctx.strokeStyle = object._s;
      object._b(ctx);
    }

    ctx.restore();
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

  // Sprite
  // ------

  function Sprite(image) {
    DisplayObject.call(this);
    this._i = image;
  }

  var SpritePrototype = Sprite.prototype = Object.create(DisplayObjectPrototype);
  SpritePrototype.constructor = Sprite;

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
  engine.Sprite = Sprite;
  engine.Stage = Stage;

})(engine);
