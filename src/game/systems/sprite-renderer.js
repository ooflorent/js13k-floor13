function SpriteRendererSystem(layer) {
  IteratingSystem.call(this, [Position.name, Display.name]);
  this.l = layer;
}

__extend(SpriteRendererSystem, IteratingSystem, {
  add: function(entity) {
    this.l.add(Pixelwars.c(entity, Display.name).gfx);
  },
  remove: function(entity) {
    this.l.remove(Pixelwars.c(entity, Display.name).gfx);
  },
  update: function(elapsed) {
    IteratingSystem.prototype.update.call(this, elapsed);

    // Sort elements
    this.l._c.sort(function(objA, objB) {
      return objA.y - objB.y;
    });

    // Render the frame
    Buffer.render();
  },
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var gfx = Pixelwars.c(entity, Display.name).gfx;

    // Update asset position
    gfx.x = position.x | 0;
    gfx.y = position.y | 0;

    // Update animation
    if (gfx instanceof AnimatedSprite) {
      gfx.advance(elapsed * 1000 | 0);
    }
  }
});
