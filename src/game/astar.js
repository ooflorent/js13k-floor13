function BinaryHeap(scoreFunction) {
  this.f = scoreFunction;
  this.d = [];
  this.n = 0;
}

__define(BinaryHeap, {
  push: function(element) {
    this.d[this.n++] = element;
    this.sd(this.n - 1);
  },
  pop: function() {
    var element = this.d[0];
    var end = this.d[--this.n];

    if (this.n) {
      this.d[0] = end;
      this.bu(0);
    }

    return element;
  },
  sd: function(i) {
    var data = this.d;
    var element = data[i];
    while (i) {
      var parentI = ((i + 1) >> 1) - 1;
      var parent = data[parentI];

      if (this.f(element) < this.f(parent)) {
        data[i] = parent;
        data[parentI] = element;
        i = parentI;
      } else {
        break;
      }
    }
  },
  bu: function(i) {
    var n = this.n;
    var data = this.d;
    var element = data[i];
    var score = this.f(element);

    while (1) {
      var child2i = (i + 1) << 1;
      var child1i = child2i - 1;
      var child1Score;
      var swap = -1;

      if (child1i < n) {
        var child1 = data[child1i];
        if ((child1Score = this.f(child1)) < score) {
          swap = child1i;
        }
      }

      if (child2i < n) {
        var child2 = data[child2i];
        if (this.f(child2) < (swap < 0 ? score : child1Score)) {
          swap = child2i;
        }
      }

      if (swap < 0) {
        break;
      }

      data[i] = data[swap];
      data[swap] = element;
      i = swap;
    }
  }
});

function pushIfExists(results, grid, x, y) {
  if (grid[y] && grid[y][x]) {
    results.push(grid[y][x]);
  }
}

function diagonalHeuristic(a, b) {
  var dx = Math.abs(a.x - b.x);
  var dy = Math.abs(a.y - b.y);

  return 10 * Math.abs(dx - dy) + ((dx > dy) ? (14 * dy) : (14 * dx));
}

var AStar = {
  init: function(map, isWall) {
    // Build the grid
    var grid = this.g = [];
    for (var y = map.h; y--;) {
      grid[y] = [];
      for (var x = map.w; x--;) {
        grid[y][x] = {
          w: isWall(map[y][x]), // Wall
          x: x, // Position X
          y: y, // Position Y
          v: 0, // Visited
          c: 0, // Closed
          h: 0, // Heuristic score
        };
      }
    }
  },
  search: function(start, end) {
    var grid = this.g;
    var heap = new BinaryHeap(function(node) {
      return node.h;
    });

    start = grid[start.y][start.x];
    end = grid[end.y][end.x];

    heap.push(start);
    while (heap.n) {
      var current = heap.pop();
      if (current === end) {
        var curr = current;
        var ret = [];

        while (curr.p) {
          ret.push(curr);
          curr = curr.p;
        }

        return ret.reverse();
      }

      current.c = 1;

      x = current.x;
      y = current.y;

      var neighbors = [];
      pushIfExists(neighbors, grid, x - 1, y); // West
      pushIfExists(neighbors, grid, x + 1, y); // East
      pushIfExists(neighbors, grid, x, y - 1); // North
      pushIfExists(neighbors, grid, x, y + 1); // South
      pushIfExists(neighbors, grid, x - 1, y - 1); // Northeast
      pushIfExists(neighbors, grid, x - 1, y + 1); // Northeast
      pushIfExists(neighbors, grid, x + 1, y - 1); // Southwest
      pushIfExists(neighbors, grid, x + 1, y + 1); // Southeast

      for (var i = neighbors.length; i--;) {
        var neighbor = neighbors[i];
        if (neighbor.c || neighbor.w) { // Closed of wall
          continue;
        }

        if (!neighbor.v) {
          neighbor.v = 1;
          neighbor.p = current;
          neighbor.h = neighbor.h || diagonalHeuristic(neighbor, end);

          heap.push(neighbor);
        }
      }
    }
  }
};
