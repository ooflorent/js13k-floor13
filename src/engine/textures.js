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
    g: function(name) {
      return textures[name];
    },
    a: function(name) {
      return animations[name];
    }
  };
})();

function Texture(source, frame) {
  this.source = source;
  this.frame = frame;
}
