/**
 * Render HUD.
 *
 * @param {DisplayObjectContainer} layer
 */
function HudSystem(layer) {
  System.call(this, Position, Display);
  this.l = layer;
}

__extend(HudSystem, System, {
  u: (function() {
    var currentWeapon;

    return function update() {
      var player = __tm.g(TAG_PLAYER);
      var health = player.g(Health);
      var weapon = player.g(Weapon);

      // Redraw weapon HUD
      if (currentWeapon != weapon) {
        currentWeapon = weapon;
      }
    };
  })()
});
