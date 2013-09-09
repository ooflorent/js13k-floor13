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

  var that = this, texture, sprite, x, y;

  function isFrontWall(dungeon, x, y) {
    return isWall(dungeon, x, y) && !isWall(dungeon, x, y + 1);
  }

  function isRoof(dungeon, x, y) {
    return isWall(dungeon, x, y) && isWall(dungeon, x, y + 1);
  }

  function createEdge(x1, y1, x2, y2) {
    return function(ctx, color) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(x1 + 0.5, y1 - 0.5);
      ctx.lineTo(x2 + 0.5, y2 - 0.5);
      ctx.stroke();
      ctx.closePath();
    };
  }

  function drawElevator(pos, up) {
    x = pos.x * 16;
    y = pos.y * 16;

    // Draw the elevator
    that.render(new Sprite(__textureManager.g('e')[0]), {x: x, y: y});

    // Draw light arrow
    x += isFrontWall(dungeon, pos.x - 1, pos.y) ? -8 : (isFrontWall(dungeon, pos.x + 1, pos.y) ? 18 : (isWall(dungeon, pos.x - 1, pos.y) ? -8 : 18));
    sprite = new Sprite(__textureManager.g('a')[0], {x: 0, y: 0.5});
    sprite.sy = up ? -1 : 1;
    that.render(sprite, {x: x, y: y + 9});
  }

  // Render map
  for (y = dungeon.h; y--;) {
    for (x = dungeon.w; x--;) {
      var pos = {x: x * 16, y: y * 16};
      var edges = [];

      if (isFrontWall(dungeon, x, y)) {
        texture = 'w';

        if (!isWall(dungeon, x, y + 1)) {
          edges.push(createEdge(0, 17, 16, 17));
        }

        if (!isWall(dungeon, x - 1, y)) {
          edges.push(createEdge(0, 0, 0, 16));
        }

        if (!isWall(dungeon, x + 1, y)) {
          edges.push(createEdge(15, 0, 15, 16));
          edges.push(createEdge(16, 0, 16, 17));
        }
      } else if (isRoof(dungeon, x, y)) {
        texture = 'r';

        if (!isRoof(dungeon, x, y - 1)) {
          edges.push(createEdge(0, 1, 16, 1));
        }

        if (!isRoof(dungeon, x, y + 1)) {
          edges.push(createEdge(0, 18, 16, 18));
        }

        if (!isWall(dungeon, x - 1, y)) {
          edges.push(createEdge(0, 0, 0, 16));
        } else if (!isRoof(dungeon, x - 1, y)) {
          edges.push(createEdge(0, 2, 0, 16));
        }

        if (!isWall(dungeon, x + 1, y)) {
          edges.push(createEdge(15, 0, 15, 16));
          edges.push(createEdge(16, 0, 16, 16));
        } else if (!isRoof(dungeon, x + 1, y)) {
          edges.push(createEdge(15, 2, 15, 16));
          edges.push(createEdge(16, 2, 16, 16));
        }
      } else {
          texture = 'f';
      }

      that.render(new Sprite(__textureManager.g(texture)[0]), pos);

      for (var e = edges.length; e--;) {
        that.render(new Graphics(edges[e], 'rgba(0,0,0,.2)'), pos);
      }
    }
  }

  // Render exits
  drawElevator(dungeon.prev);
  drawElevator(dungeon.next, 1);
}

__extend(Tilemap, RenderTexture);
