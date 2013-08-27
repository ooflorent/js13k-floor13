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

function blendOverlay(a, b) {
  if (a > 128) {
    return a - (255 - a) + b * (255 - a) / 128;
  } else {
    return b * a / 128;
  }
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

function mosaic(scale) {
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
}

var TextureManager = (function() {
  return {
    i: null,
    a: {},
    g: {},
    init: function(spritesheet, onLoad) {
      var img = this.i = new Image();
      img.src = spritesheet;
      img.onload = function() {
        onLoad();
      };
    },
    slice: function(name, x, y, width, height, repeatX, repeatY) {
      repeatX = repeatX || 1;
      repeatY = repeatY || 1;

      var group = this.g[name] = [];
      for (var iy = 0; iy < repeatY; iy++) {
        for (var ix = 0; ix < repeatX; ix++) {
          group.push({
            x: x + ix * width,
            y: y + iy * height,
            w: width,
            h: height
          });
        }
      }
    },
    anim: function(name, frames, duration) {
      if (duration) {
        duration = 1 / duration * 1000 | 0;
      } else {
        duration = 0xFFFFFFFF;
      }

      this.a[name] = {
        n: name,
        f: frames,
        d: duration
      };
    },
    random: function(name) {
      return getRandomElement(this.g[name]);
    }
  };
})();

var Renderer = (function() {
  function Renderer(width, height) {
    var canvas = this.canvas = createCanvas();
    var ctx = this.ctx = canvas.getContext('2d');

    this.w = canvas.width = width;
    this.h = canvas.height = height;
  }

  define(Renderer.prototype, {
    render: function(stage, elapsed) {
      var ctx = this.ctx;
      var canvas = this.canvas;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillRect(0, 0, this.w, this.h);

      stage._transform();
      this.renderObject(stage, elapsed * 1000 | 0);
    },
    renderObject: function(object, elapsed) {
      if (!object._a) {
        return;
      }

      if (object instanceof DisplayObjectContainer) {
        var children = object._c;
        var i = children.length;

        while (i--) {
          this.renderObject(children[i], elapsed);
        }

        return;
      }

      var ctx = this.ctx;

      ctx.setTransform(object.sx, 0, 0, object.sy, object._x, object._y);
      ctx.globalAlpha = object._a;

      if (object instanceof Sprite) {
        var rect = object.group[object.frame];
        ctx.drawImage(TextureManager.i, rect.x, rect.y, rect.w, rect.h, object.sx < 0 ? object.sx * rect.w : 0, object.sy < 0 ? object.sy * rect.h : 0, rect.w, rect.h);
        object.advance(elapsed);
      } else if (object instanceof Graphics) {
        object._batch(ctx, object._color);
      }
    }
  });

  return Renderer;
})();

var Buffer = (function() {
  var ctx;
  var renderer;
  var width;
  var height;

  return {
    init: function(w, h, s, canvas) {
      canvas.width = w * s;
      canvas.height = h * s;

      ctx = canvas.getContext('2d');
      ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
      ctx.setTransform(s, 0, 0, s, 0, 0);

      renderer = new Renderer(w, h);

      this.stage = new Stage();
    },
    render: function(elapsed) {
      renderer.render(this.stage, elapsed);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(renderer.canvas, 0, 0);
    }
  };
})();

var DisplayObject = (function() {
  function DisplayObject() {
    this.x = 0;
    this.y = 0;
    this.a = 1;
    this.sx = this.sy = 1;

    this._x = 0;
    this._y = 0;
    this._a = 1;
    this._p = null;
  }

  define(DisplayObject.prototype, {
    _transform: function() {
      var parent = this._p;

      // Calculate effective position
      this._x = parent._x + this.x;
      this._y = parent._y + this.y;

      // Calculate effective alpha
      this._a = this.a * parent._a;
    }
  });

  return DisplayObject;
})();

var Graphics = (function(_super) {
  function Graphics(batch, color) {
    _super.call(this);
    this._batch = batch;
    this._color = color;
  }

  extend(Graphics, _super);
  return Graphics;
})(DisplayObject);

var Sprite = (function(_super) {
  function Sprite(group, frame) {
    _super.call(this);
    this.group = TextureManager.g[group];
    this.frame = frame || 0;
    this.anim = null;
    this.i = this.t = 0;
  }

  extend(Sprite, _super);
  define(Sprite.prototype, {
    play: function(anim) {
      if (!this.anim || this.anim.n != anim) {
        this.anim = TextureManager.a[anim];
        this.frame = this.anim.f[this.i = this.t = 0];
      }
    },
    advance: function(elapsed) {
      if (this.anim) {
        // Go to the next frame
        var frames = this.anim.f;
        var duration = this.anim.d;

        this.t += elapsed;
        while (this.t >= duration) {
          this.t -= duration;
          this.i = (this.i + 1) % frames.length;
          this.frame = frames[this.i];
        }
      }
    }
  });

  return Sprite;
})(DisplayObject);

var DisplayObjectContainer = (function(_super) {
  function DisplayObjectContainer() {
    _super.call(this);
    this._c = [];
  }

  extend(DisplayObjectContainer, _super);
  define(DisplayObjectContainer.prototype, {
    add: function(child) {
      if (child._p) {
        child._p.remove(child);
      }

      this._c.push(child);
      child._p = this;
    },
    remove: function(child) {
      var children = this._c;
      var i = children.indexOf(child);
      if (i >= 0) {
        children.splice(i, 1);
        child._p = null;
      }
    },
    _transform: function() {
      _super.prototype._transform.call(this);

      var children = this._c;
      var i = children.length;

      while (i--) {
        children[i]._transform();
      }
    }
  });

  return DisplayObjectContainer;
})(DisplayObject);

var Stage = (function(_super) {
  function Stage() {
    _super.call(this);
  }

  extend(Stage, _super);
  define(Stage.prototype, {
    _transform: function() {
      var children = this._c;
      var i = children.length;

      while (i--) {
        children[i]._transform();
      }
    }
  });

  return Stage;
})(DisplayObjectContainer);
