var SpriteLib = (function() {
  function preload(src) {
    var request = new XMLHttpRequest();

    request.open('GET', src, false);
    request.send(null);
  }

  var image;

  return {
    init: function(src) {
      preload(src);

      image = new Image();
      image.src = src;
    }
  };
})();
