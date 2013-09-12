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
    left = box.a(new Sprite(__textureManager.g('bl')[0]));

    // Background
    bg = box.a(new Sprite(__textureManager.g('bb')[0]));
    bg.x = left.tx.f.w;
    bg.sx = width;

    // Right corner
    right = box.a(new Sprite(__textureManager.g('br')[0]));
    right.x = bg.x + width;

    return box;
  }

  function createTextBox(width) {
    var box = new DisplayObjectContainer();
    var bg, right;

    // Background
    bg = box.a(new Sprite(__textureManager.g('tb')[0]));
    bg.sx = width;

    // Right corner
    right = box.a(new Sprite(__textureManager.g('tr')[0]));
    right.x = width;

    return box;
  }

  var weaponBox = layer.a(createBigBox(14));
  var healthBox = layer.a(createBigBox(6));
  var bulletBox = layer.a(createBigBox(6));

  var healthTextBox = healthBox.a(createTextBox(8));
  var bulletTextBox = bulletBox.a(createTextBox(8));

  weaponBox.x = 1;
  healthBox.x = 27;
  bulletBox.x = 57;
  weaponBox.y = healthBox.y = bulletBox.y = 1;

  healthTextBox.x = bulletTextBox.x = 14;
  healthTextBox.y = bulletTextBox.y = 3;

  var heart = healthBox.a(new Sprite(__textureManager.g('hh')[0]));
  var bullet = bulletBox.a(new Sprite(__textureManager.g('hb')[0]));
  heart.x = bullet.x = 2;
  heart.y = 5;
  bullet.y = 4;

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

