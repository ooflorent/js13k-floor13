function createCanvas() {
  return document.createElement('canvas');
}

function Renderer(width, height) {
  var canvas = this.canvas = createCanvas();
  var ctx = this.ctx = canvas.getContext('2d');

  this.w = canvas.width = width;
  this.h = canvas.height = height;
}

__define(Renderer, {
  render: function(stage) {
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillRect(0, 0, this.w, this.h);

    stage._transform();
    this.renderObject(stage);
  },
  renderObject: function(object) {
    if (object instanceof DisplayObjectContainer) {
      var children = object._c;
      for (var i = 0, n = children.length; i < n; i++) {
        this.renderObject(children[i]);
      }

      return;
    }

    var ctx = this.ctx;

    if (object instanceof Sprite) {
      if (object.texture instanceof RenderTexture) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(object.texture.s, -object._x, -object._y, this.w, this.h, 0, 0, this.w, this.h);
      } else {
        var frame = object.texture.f;
        ctx.setTransform(object.sx, 0, 0, object.sy, object._x, object._y);
        ctx.drawImage(object.texture.s, frame.x, frame.y, frame.w, frame.h, -object.c.x * frame.w | 0, -object.c.y * frame.h | 0, frame.w, frame.h);
      }
    } else if (object instanceof Graphics) {
      ctx.setTransform(object.sx, 0, 0, object.sy, object._x, object._y);
      object._batch(ctx, object._color);
    }
  }
});

function DisplayObject() {
  this.x = this.y = 0;
  this.sx = this.sy = 1;

  this._x = this._y = 0;
  this._p = null;
}

__define(DisplayObject, {
  _transform: function() {
    var parent = this._p;

    // Calculate effective position
    this._x = parent._x + this.x;
    this._y = parent._y + this.y;
  }
});

function Graphics(batch, color) {
  DisplayObject.call(this);
  this._batch = batch;
  this._color = color;
}

__extend(Graphics, DisplayObject);

function Sprite(texture, c) {
  DisplayObject.call(this);
  this.texture = texture;
  this.c = c || {x: 0, y: 0};
}

__extend(Sprite, DisplayObject);

function AnimatedSprite(textures, animations, defaultAnimation, c) {
  Sprite.call(this, 0, c);
  this.t = textures;
  this.a = animations;
  this.play(defaultAnimation);
}

__extend(AnimatedSprite, Sprite, {
  play: function(anim) {
    if (this.an != anim) {
      this.texture = this.t[this.a[this.an = anim].f[this.f = this.d = 0]];
    }
  },
  advance: function(elapsed) {
    if (this.an) {
      var frames = this.a[this.an].f;
      var duration = this.a[this.an].d;

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

function RenderTexture(width, height) {
  this.frame = {
    x: 0,
    y: 0,
    w: width,
    h: height
  };
  this.r = new Renderer(width, height);
  this.s = this.r.canvas;
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

