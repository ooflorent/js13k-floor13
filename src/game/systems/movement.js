function MovementSystem() {
  IteratingSystem.call(this, [Position.name, Motion.name]);
}

__extend(MovementSystem, IteratingSystem, {
  onUpdate: function(entity, elapsed) {
    var position = Pixelwars.c(entity, Position.name);
    var motion = Pixelwars.c(entity, Motion.name);

    position.x += elapsed * motion.dx;
    position.y += elapsed * motion.dy;
    position.r = motion.dr;
  }
});
