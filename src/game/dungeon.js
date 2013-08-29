var TILE_BLANK = 0;
var TILE_FLOOR = 1;
var TILE_CORNER = 2;
var TILE_WALL_N = 3;
var TILE_WALL_E = 4;
var TILE_WALL_S = 5;
var TILE_WALL_W = 6;

function Dungeon(width, height) {
  Array2.call(this, width, height);
  this.r = []; // Rooms
  this.d = []; // Doors
  this.prev = this.next = null; // Entrance and exit
}

__extend(Dungeon, Array2);

function isWall(dungeon, x, y) {
  return x >= 0 && y >= 0 && x < dungeon.w && y < dungeon.h && dungeon.g(x, y) != TILE_FLOOR;
}

var generateDungeon = (function() {
  var DIRECTION = [];
  var DIRECTION_N = DIRECTION[TILE_WALL_N] = 1;
  var DIRECTION_E = DIRECTION[TILE_WALL_E] = 2;
  var DIRECTION_S = DIRECTION[TILE_WALL_S] = 3;
  var DIRECTION_W = DIRECTION[TILE_WALL_W] = 4;

  function Room(width, height) {
    Array2.call(this, width, height);
      this.x = this.y = 0;
  }

  __extend(Room, Array2);

  function isCorner(a, b, ab) {
    return a && b && !ab || !a && !b;
  }

  function generateDungeon(width, height, minSize, maxSize) {
    var dungeon = new Dungeon(width, height);
    var room = generateRoom(minSize, maxSize);

    placeRoom(dungeon, room, (width - room.w) / 2 | 0, (height - room.h) / 2 | 0);

    var x, y;
    var it = width * height * 2;
    for (var i = 0; i < it; i++) {
      var branchingPos = getBranchingPosition(dungeon);
      var direction = DIRECTION[dungeon.g(branchingPos.x, branchingPos.y)];

      if (direction) {
        room = generateRoom(minSize, maxSize);

        if (direction == DIRECTION_N) {
          x = branchingPos.x - room.w / 2;
          y = branchingPos.y - room.h / 2;
        } else if (direction == DIRECTION_E) {
          x = branchingPos.x + 1;
          y = branchingPos.y - room.h / 2;
        } else if (direction == DIRECTION_S) {
          x = branchingPos.x - room.w / 2;
          y = branchingPos.y + 1;
        } else { // WEST
          x = branchingPos.x - room.w;
          y = branchingPos.y - room.h / 2;
        }

        x |= 0;
        y |= 0;

        if (hasEnoughtSpaceForRoom(dungeon, room, x, y)) {
          placeRoom(dungeon, room, x, y);
          connectRooms(dungeon, branchingPos, direction);
        } else {
          i++;
        }
      }
    }

    // Some corners may have been turned into normal wall.
    // Let's fix this.
    for (y = height; y--;) {
      for (x = width; x--;) {
        if (dungeon.g(x, y) != TILE_CORNER) {
          continue;
        }

        var n = isWall(dungeon, x, y - 1);
        var s = isWall(dungeon, x, y + 1);
        var w = isWall(dungeon, x - 1, y);
        var e = isWall(dungeon, x + 1, y);
        var nw = isWall(dungeon, x - 1, y - 1);
        var ne = isWall(dungeon, x + 1, y - 1);
        var sw = isWall(dungeon, x - 1, y + 1);
        var se = isWall(dungeon, x + 1, y + 1);

        if (!isCorner(n, w, nw) && !isCorner(n, e, ne) && !isCorner(s, w, sw) && !isCorner(s, e, se)) {
          if (n && s) {
            dungeon.s(x, y, e ? TILE_WALL_E : TILE_WALL_W); // Vertical wall
          } else {
            dungeon.s(x, y, s ? TILE_WALL_S : TILE_WALL_N); // Horizontal wall
          }
        }
      }
    }

    // Define entrance and exit
    var entrance = getRandomElement(dungeon.r);
    var exit;
    do {
      exit = getRandomElement(dungeon.r);
    } while (entrance === exit);

    dungeon.prev = {
      x: entrance.x + getRandomInt(1, entrance.w - 2),
      y: entrance.y + getRandomInt(1, entrance.h - 2)
    };

    dungeon.next = {
      x: exit.x + getRandomInt(1, exit.w - 2),
      y: exit.y + getRandomInt(1, exit.h - 2)
    };

    if (__PW_DEBUG) {
      console.log(dumpDungeon(dungeon));
    }

    return dungeon;
  }

  function generateRoom(minSize, maxSize) {
    var sizeX = getRandomInt(minSize, maxSize);
    var sizeY = getRandomInt(minSize, maxSize);
    var room = new Room(sizeX, sizeY);

    var maxX = sizeX - 1;
    var maxY = sizeY - 1;

    for (var y = 0; y < sizeY; y++) {
      for (var x = 0; x < sizeX; x++) {
        if (!x && !y || !x && y == maxY || x == maxX && !y || x == maxX && y == maxY) {
          room.s(x, y, TILE_CORNER);
        } else if (!x) {
          room.s(x, y, TILE_WALL_W);
        } else if (!y) {
          room.s(x, y, TILE_WALL_N);
        } else if (x == maxX) {
          room.s(x, y, TILE_WALL_E);
        } else if (y == maxY) {
          room.s(x, y, TILE_WALL_S);
        } else {
          room.s(x, y, TILE_FLOOR);
        }
      }
    }

    return room;
  }

  function placeRoom(dungeon, room, roomX, roomY) {
    room.x = roomX;
    room.y = roomY;

    dungeon.r.push(room);
    dungeon.p(room, roomX, roomY);
  }

  function getBranchingPosition(dungeon) {
    var room = getRandomElement(dungeon.r);

    for (var i = room.w * room.h; i--;) {
      var x = room.x + getRandomInt(0, room.w - 1);
      var y = room.y + getRandomInt(0, room.h - 1);

      if (dungeon.g(x, y) > TILE_CORNER) {
        return {x: x, y: y};
      }
    }

    return {x: 0, y: 0};
  }

  function hasEnoughtSpaceForRoom(dungeon, room, gridX, gridY) {
    for (var y = room.h; y--;) {
      for (var x = room.w; x--;) {
        var roomX = x + gridX;
        var roomY = y + gridY;

        if (roomX < 0 || roomX >= dungeon.w || roomY < 0 || roomY >= dungeon.h || dungeon.g(roomX, roomY)) {
          return false;
        }
      }
    }

    return true;
  }

  function connectRooms(dungeon, branchingPos, direction) {
    var corners = [];

    if (direction == DIRECTION_N) {
      corners.push([-1, 0], [-1, -1], [1, 0], [1, -1]);
      dungeon.s(branchingPos.x, branchingPos.y - 1, TILE_FLOOR);
    } else if (direction == DIRECTION_E) {
      corners.push([0, -1], [1, -1], [0, 1], [1, 1]);
      dungeon.s(branchingPos.x + 1, branchingPos.y,  TILE_FLOOR);
    } else if (direction == DIRECTION_S) {
      corners.push([-1, 0], [-1, 1], [1, 0], [1, 1]);
      dungeon.s(branchingPos.x, branchingPos.y + 1,  TILE_FLOOR);
    } else { // WEST
      corners.push([0, -1], [-1, -1], [0, 1], [-1, 1]);
      dungeon.s(branchingPos.x - 1, branchingPos.y,  TILE_FLOOR);
    }

    // Mark adjacent tiles as corners
    for (var i = 4; i--;) {
      dungeon.s(branchingPos.x + corners[i][0], branchingPos.y + corners[i][1], TILE_CORNER);
    }

    // Open the wall and put a door
    dungeon.s(branchingPos.x, branchingPos.y, TILE_FLOOR);
    dungeon.d.push(branchingPos);
  }

  return generateDungeon;
})();

if (__PW_DEBUG) {
  var dumpDungeon = function(dungeon) {
    var s = '';
    for (var y = 0; y < dungeon.h; y++) {
      for (var x = 0; x < dungeon.w; x++) {
        var t = dungeon.g(x, y);
        var tile;
        switch (t) {
          case 1:
            tile = ' ';
            break;

          case 0:
            tile = '#';
            break;

          case 2:
          case 3:
          case 5:
          case 4:
          case 6:
            tile = t;
            break;

          default:
            tile = '?';
        }

        s += tile;
      }

      s += "\n";
    }

    return s;
  };
}
