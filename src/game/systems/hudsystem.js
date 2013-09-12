/**
 * Render HUD.
 *
 * @param {DisplayObjectContainer} layer
 */
function HUDSystem(layer) {
  System.call(this);

  function createBigBox(width) {
    var box = new DisplayObjectContainer();
    var left, bg, right;

    // Left border
    left = box.a(new Sprite(__textureManager.g('hl')[0]));

    // Background
    bg = box.a(new Sprite(__textureManager.g('hb')[0]));
    bg.x = left.tx.f.w;
    bg.sx = width;

    // Right corner
    right = box.a(new Sprite(__textureManager.g('hr')[0]));
    right.x = bg.x + width;

    return box;
  }

  var weaponBox = layer.a(createBigBox(14));
  var heartBox = layer.a(createBigBox(6));
  var bulletBox = layer.a(createBigBox(6));

  weaponBox.x = 4;
  heartBox.x = 30
  bulletBox.x = 60;
  weaponBox.y = heartBox.y = bulletBox.y = 4;

  __mixin(this, System.prototype);
  __mixin(this, {
    u: function update() {
      /*console.log('ok')
      var player = __tm.g(TAG_PLAYER);
      var health = player.g(Health);
      var weapon = player.g(Weapon);

      // Redraw weapon HUD
      if (currentWeapon != weapon) {
        currentWeapon = weapon;
      }*/
    }
  });
}

