function createCanvas() {
  return document.createElement('canvas');
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

    ctx.setTransform(object.sx, 0, 0, object.sy, object._x, object._y);
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
  var scale;
  var width;
  var height;

  var textureCanvas;
  var textureCtx;
  var texture;

  function clickHandler(event) {
    EventManager.emit('click', {x: event.layerX / scale | 0 , y: event.layerY / scale | 0});
  }

  return {
    init: function(w, h, s, canvas, stage) {
      scale = s;
      canvas.width = width = w * s;
      canvas.height = height = h * s;

      ctx = canvas.getContext('2d');
      ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;

      textureCanvas = createCanvas();
      textureCanvas.width = textureCanvas.height = scale;
      textureCtx = textureCanvas.getContext('2d');
      textureCtx.fillStyle = 'rgba(255,255,255,.05)';
      textureCtx.fillRect(1, 0, scale - 2, 1);
      textureCtx.fillRect(0, 1, 1, scale - 2);
      textureCtx.fillStyle = 'rgba(0,0,0,.1)';
      textureCtx.fillRect(1, scale - 1, scale - 2, 1);
      textureCtx.fillRect(scale - 1, 1, 1, scale - 2);
      texture = ctx.createPattern(textureCanvas, 'repeat');

      this.renderer = renderer = new Renderer(w, h);
      this.stage = stage;

      canvas.addEventListener('click', clickHandler);
    },
    clear: function() {
      canvas.removeEventListener('click', clickHandler);
    },
    render: function(elapsed) {
      renderer.render(this.stage, elapsed);

      // Draw game
      ctx.drawImage(renderer.canvas, 0, 0, renderer.w, renderer.h, 0, 0, width, height);

      // Draw pixel filter
      ctx.fillStyle = texture;
      ctx.fillRect(0, 0, width, height);
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
    return child;
  },
  remove: function(child) {
    var children = this._c;
    var i = children.indexOf(child);
    if (i >= 0) {
      children.splice(i, 1);
      child._p = null;
    }
    return child;
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
