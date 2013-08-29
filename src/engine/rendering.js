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
  var image;
  var textures = {};
  var animations = {};

  return {
    init: function(spritesheet, onLoad) {
      image = new Image();
      image.src = spritesheet;
      image.onload = function() {
        onLoad();
      };
    },
    slice: function(name, x, y, width, height, repeatX, repeatY) {
      repeatX = repeatX || 1;
      repeatY = repeatY || 1;

      var frames = textures[name] = [];
      for (var iy = 0; iy < repeatY; iy++) {
        for (var ix = 0; ix < repeatX; ix++) {
          frames.push(new Texture(image, {
            x: x + ix * width,
            y: y + iy * height,
            w: width,
            h: height
          }));
        }
      }
    },
    get: function(name) {
      return textures[name];
    },
    anim: function(name, frames, duration) {
      if (duration) {
        duration = 1 / duration * 1000 | 0;
      } else {
        duration = 0xFFFFFFFF;
      }

      animations[name] = {
        n: name,
        f: frames,
        d: duration
      };
    },
    a: function(name) {
      return animations[name];
    },
    random: function(name) {
      return getRandomElement(textures[name]);
    }
  };
})();

function Texture(source, frame) {
  this.source = source;
  this.frame = frame;
}

function RenderTexture(width, height) {
  this.frame = {
    x: 0,
    y: 0,
    w: width,
    h: height
  };
  this.r = new Renderer(width, height);
  this.source = this.r.canvas;
}

__define(RenderTexture, {
  render: function(object, position) {
    if (position) {
      object._x = position.x;
      object._y = position.y;
    }

    this.r.renderObject(object);
  }
});

function Renderer(width, height) {
  var canvas = this.canvas = createCanvas();
  var ctx = this.ctx = canvas.getContext('2d');

  this.w = canvas.width = width;
  this.h = canvas.height = height;

  // Camera
  this.cx = this.cy = 0;
}

__define(Renderer, {
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
      for (var i = 0, n = children.length; i < n; i++) {
        this.renderObject(children[i], elapsed);
      }

      return;
    }

    var ctx = this.ctx;

    ctx.setTransform(object.sx, 0, 0, object.sy, -this.cx + object._x, -this.cy + object._y);
    ctx.globalAlpha = object._a;

    if (object instanceof Sprite) {
      var frame = object.texture.frame;
      ctx.drawImage(object.texture.source, frame.x, frame.y, frame.w, frame.h, object.sx < 0 ? object.sx * frame.w : 0, object.sy < 0 ? object.sy * frame.h : 0, frame.w, frame.h);
    } else if (object instanceof Graphics) {
      object._batch(ctx, object._color);
    }

    if (object instanceof AnimatedSprite) {
      object.advance(elapsed);
    }
  }
});

var Buffer = (function() {
  var ctx;
  var renderer;
  var width;
  var height;

  return {
    init: function(w, h, s, canvas) {
      canvas.width = width = w * s;
      canvas.height = height = h * s;

      ctx = canvas.getContext('2d');
      ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
      ctx.setTransform(s, 0, 0, s, 0, 0);

      this.renderer = renderer = new Renderer(w, h);
      this.stage = new Stage();
    },
    render: function(elapsed) {
      renderer.render(this.stage, elapsed);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(renderer.canvas, 0, 0);
    }
  };
})();

function DisplayObject() {
  this.x = this.y = 0;
  this.alpha = this.sx = this.sy = 1;

  this._x = this._y = 0;
  this._a = 1;
  this._p = null;
}

__define(DisplayObject, {
  _transform: function() {
    var parent = this._p;

    // Calculate effective position
    this._x = parent._x + this.x;
    this._y = parent._y + this.y;

    // Calculate effective alpha
    this._a = this.alpha * parent._a;
  }
});

function Graphics(batch, color) {
  DisplayObject.call(this);
  this._batch = batch;
  this._color = color;
}

__extend(Graphics, DisplayObject);

function Sprite(texture) {
  DisplayObject.call(this);
  this.texture = texture;
}

__extend(Sprite, DisplayObject);

function AnimatedSprite(textures, animations, defaultAnimation) {
  Sprite.call(this);
  this.t = textures;
  this.a = animations;
  this.play(defaultAnimation);
}

__extend(AnimatedSprite, Sprite, {
  play: function(anim) {
    if (this.c != anim) {
      this.texture = this.t[this.a[this.c = anim].f[this.f = this.d = 0]];
    }
  },
  advance: function(elapsed) {
    if (this.c) {
      var frames = this.a[this.c].f;
      var duration = this.a[this.c].d;

      //console.log(this);

      // Go to the next frame
      this.d += elapsed;
      while (this.d >= duration) {
        this.d -= duration;
        this.f = (this.f + 1) % frames.length;
        this.texture = this.t[frames[this.f]];
      }
    }
  }
});

function DisplayObjectContainer() {
  DisplayObject.call(this);
  this._c = [];
}

__extend(DisplayObjectContainer, DisplayObject, {
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
    DisplayObject.prototype._transform.call(this);

    var children = this._c;
    var i = children.length;

    while (i--) {
      children[i]._transform();
    }
  }
});

function Stage() {
  DisplayObjectContainer.call(this);
}

__extend(Stage, DisplayObjectContainer, {
  _transform: function() {
    var children = this._c;
    var i = children.length;

    while (i--) {
      children[i]._transform();
    }
  }
});
