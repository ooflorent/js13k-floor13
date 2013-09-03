function BoundsRendererSystem(layer) {
  IteratingSystem.call(this, [Position.name, Bounds.name]);
  this.l = layer;
}

__extend(BoundsRendererSystem, IteratingSystem, {
  add: function(entity) {
    var bounds = Pixelwars.c(entity, Bounds.name);
    bounds.gfx = new Graphics(function(ctx, color) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,255,0,.5)';
      ctx.strokeRect(0.5, 0.5, bounds.w - 1, bounds.h - 1);
      ctx.closePath();
    });

    this.l.add(bounds.gfx);
  },
  remove: function(entity) {
    this.l.remove(Pixelwars.c(entity, Bounds.name).gfx);
  },
  onUpdate: function(entity) {
    var position = Pixelwars.c(entity, Position.name);
    var bounds = Pixelwars.c(entity, Bounds.name);

    bounds.gfx.x = bounds.x + position.x | 0;
    bounds.gfx.y = bounds.y + position.y | 0;
  }
});
