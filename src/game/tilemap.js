function toGrid(x, y) {
  return {
    x: x / 16 | 0,
    y: y / 16 | 0,
    dx: x % 16,
    dy: y % 16
  };
}

function Tilemap(dungeon) {
  RenderTexture.call(this, dungeon.w * 16, dungeon.h * 16);

  function isFrontWall(dungeon, x, y) {
    return isWall(dungeon, x, y) && !isWall(dungeon, x, y + 1);
  }

  function isRoof(dungeon, x, y) {
    return isWall(dungeon, x, y) && isWall(dungeon, x, y + 1);
  }

  function createEdge(x1, y1, x2, y2, c) {
    return function(ctx, color) {
      ctx.beginPath();
      ctx.strokeStyle = c || color;
      ctx.moveTo(x1 + 0.5, y1 - 0.5);
      ctx.lineTo(x2 + 0.5, y2 - 0.5);
      ctx.stroke();
      ctx.closePath();
    };
  }

  var shadow = 'rgba(0,0,0,.15)';
  var texture;
  for (var y = dungeon.h; y--;) {
    for (var x = dungeon.w; x--;) {
      var pos = {x: x * 16, y: y * 16};
      var edges = [];

      if (isFrontWall(dungeon, x, y)) {
        texture = 'w';

        if (!isWall(dungeon, x, y + 1)) {
          edges.push(createEdge(0, 17, 16, 17, shadow));
        }

        if (!isWall(dungeon, x - 1, y)) {
          edges.push(createEdge(0, 0, 0, 16));
        }

        if (!isWall(dungeon, x + 1, y)) {
          edges.push(createEdge(15, 0, 15, 16));
          edges.push(createEdge(16, 0, 16, 17, shadow));
        }
      } else if (isRoof(dungeon, x, y)) {
        texture = 'r';

        if (!isRoof(dungeon, x, y - 1)) {
          edges.push(createEdge(0, 1, 16, 1));
        }

        if (!isRoof(dungeon, x, y + 1)) {
          edges.push(createEdge(0, 16, 16, 16));
        }

        if (!isRoof(dungeon, x - 1, y)) {
          edges.push(createEdge(0, 0, 0, 16));
        }

        if (!isRoof(dungeon, x + 1, y)) {
          edges.push(createEdge(15, 0, 15, 16));
          edges.push(createEdge(16, 0, 16, 16, shadow));
        }
      } else {
          texture = 'f';
      }

      this.render(new Sprite(__textureManager.g(texture)[0]), pos);

      for (var e = edges.length; e--;) {
        this.render(new Graphics(edges[e], '#2f2b2a'), pos);
      }
    }
  }
}

__extend(Tilemap, RenderTexture);
