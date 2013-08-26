var generateDungeon = (function() {
  var TILE_BLANK = 0;
  var TILE_FLOOR = 1;
  var TILE_CORNER = 2;
  var TILE_WALL_N = 3;
  var TILE_WALL_E = 4;
  var TILE_WALL_S = 5;
  var TILE_WALL_W = 6;
  var TILE_DOOR = 7;

  var DIRECTION = [];
  var DIRECTION_N = DIRECTION[TILE_WALL_N] = 1;
  var DIRECTION_E = DIRECTION[TILE_WALL_E] = 2;
  var DIRECTION_S = DIRECTION[TILE_WALL_S] = 3;
  var DIRECTION_W = DIRECTION[TILE_WALL_W] = 4;

  var Dungeon = (function(_super) {
    function Dungeon(width, height) {
      _super.call(this, width, height);
      this.r = [];
    }

    extend(Dungeon, _super);
    return Dungeon;
  })(Array2);

  var Room = (function(_super) {
    function Room(width, height) {
      _super.call(this, width, height);
      this.x = this.y = 0;
    }

    extend(Room, _super);
    return Room;
  })(Array2);

  function generateDungeon(width, height, minSize, maxSize) {
    var dungeon = new Dungeon(width, height);
    var room = generateRoom(minSize, maxSize);

    placeRoom(dungeon, room, (width - room.w) / 2 | 0, (height - room.h) / 2 | 0);

    var n = width * height * 2;
    for (var i = 0; i < n; i++) {
      var branchingPos = getBranchingPosition(dungeon);
      var direction = DIRECTION[dungeon.g(branchingPos.x, branchingPos.y)];

      if (direction) {
        room = generateRoom(minSize, maxSize);

        var x, y;
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
        return {
          x: x,
          y: y
        };
      }
    }

    return {
      x: 0,
      y: 0
    };
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
    dungeon.s(branchingPos.x, branchingPos.y, TILE_DOOR);

    if (direction == DIRECTION_N) {
      dungeon.s(branchingPos.x, branchingPos.y - 1, TILE_FLOOR);
    } else if (direction == DIRECTION_E) {
      dungeon.s(branchingPos.x + 1, branchingPos.y,  TILE_FLOOR);
    } else if (direction == DIRECTION_S) {
      dungeon.s(branchingPos.x, branchingPos.y + 1,  TILE_FLOOR);
    } else { // WEST
      dungeon.s(branchingPos.x - 1, branchingPos.y,  TILE_FLOOR);
    }
  }

  return generateDungeon;
})();

if (__PW_DEBUG) {
  var dumpDungeon = function(dungeon) {
    var s = '';
    for (var y = 0; y < dungeon.h; y++) {
      for (var x = 0; x < dungeon.w; x++) {
        var tile;
        switch (dungeon.g(x, y)) {
          case 1:
            tile = ' ';
            break;

          case 0:
            tile = '▓';
            break;

          case 2:
          case 3:
          case 5:
          case 4:
          case 6:
            tile = '░';
            break;

          case 7:
            tile = 'x';
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

console.log(dumpDungeon(generateDungeon(80, 50, 4, 12)));
