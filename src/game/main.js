// Globals
// -------

// Game managers
var __evt = new EventManager();
var __em = new EntityManager(__evt);
var __gm = new GroupManager(__evt);
var __sm = new SystemManager(__evt);
var __tm = new TagManager(__evt);

// Tick dispatcher
var __ticker = new Ticker();

// Rendering engine
var __stage = new Stage();
var __buffer = new Buffer($('g'), __PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE);
var __textureManager = new TextureManager();


// Identifiers
// -----------

// Tags
var TAG_PLAYER = 1;
var TAG_WORLD = 2;

// Groups
var GROUP_PORTALS = 1;
var GROUP_DOORS = 2;
var GROUP_ENEMIES = 3;
var GROUP_BULLETS = 4;

// Events
var EVENT_HIT = 'h';

// Animation states
var STATE_IDLE = '_';
var STATE_WALK = 'w';
var STATE_ATTACK = 'a';


// Textures and animations
// -----------------------

// World tiles
__textureManager.s('r', 0, 0, 16, 16);    // Roof
__textureManager.s('w', 0, 16, 16, 16);   // North wall
__textureManager.s('f', 0, 32, 16, 16);   // Floor
__textureManager.s('dh', 16, 30, 16, 18); // Horizontal door
__textureManager.s('dv', 112, 0, 5, 25);  // Vertical door
__textureManager.s('e', 32, 31, 16, 16);  // Elevator
__textureManager.s('a', 48, 30, 7, 10);   // Arrow

// Mobs
__textureManager.s('h', 16, 0, 8, 15, 12);  // Hero
__textureManager.s('b', 16, 15, 8, 15, 12); // Bodyguard

// Effects
__textureManager.s('bh', 44, 47, 4, 1);   // Bullet
__textureManager.s('bv', 48, 44, 1, 4);   // Bullet
__textureManager.s('d', 62, 40, 7, 7, 3); // Dash

// Animations
__textureManager.d('_s', [0]);             // Idle south
__textureManager.d('_n', [1]);             // Idle north
__textureManager.d('_h', [2]);             // Idle west or east
__textureManager.d('ws', [3, 4], 6);       // Walking south
__textureManager.d('wn', [5, 6], 6);       // Walking north
__textureManager.d('wh', [7, 2, 8, 2], 9); // Walking west or east
__textureManager.d('as', [9]);             // Attacking south
__textureManager.d('an', [10]);            // Attacking north
__textureManager.d('ah', [11]);            // Attacking west or east
__textureManager.d('d', [0, 1, 2], 12);    // Dash


// Game runner
// -----------

/**
 * Start the game.
 */
function main() {
  // Load the main spritesheet
  __textureManager.l(__PW_ASSETS_DIR + 't.png', function onLoad() {
    __ticker.start(function titleLoop() {
      if (Input.a()) {
        // Initialize the game
        initializeGame();

        // Start the game loop
        __ticker.stop();
        __ticker.start(gameLoop);

        // Display game screen
        $('p').className = 'g';
      }
    });
  });
}

/**
 * Process the current tick.
 * @param  {float} elapsed
 */
function gameLoop(elapsed) {
  __sm.u(elapsed);
  __buffer.r(__stage);
}


// Game initialization
// -------------------

function initializeGame() {
  // Create game layers
  var cameraLayer = __stage.add(new DisplayObjectContainer());
  var hudLayer    = __stage.add(new DisplayObjectContainer());
  var gameLayer   = cameraLayer.add(new DisplayObjectContainer());
  var debugLayer  = __PW_DEBUG ? cameraLayer.add(new DisplayObjectContainer()) : null;

  // Create game systems
  __sm.a(new KeyboardControlSystem());
  __sm.a(new PathFollowSystem());
  __sm.a(new MovementSystem());
  __sm.a(new CollisionSystem());
  __sm.a(new BulletSystem());
  __sm.a(new DamageSystem());
  __sm.a(new CameraSystem(cameraLayer));
  __PW_DEBUG && __sm.a(new BoundsRenderingSystem(debugLayer));
  __sm.a(new SpriteDirectionSystem());
  __sm.a(new RenderingSystem(gameLayer));
  __sm.a(new ExpirationSystem());

  // Generate world
  var world = EntityCreator.world();
  var dungeon = world.g(Dungeon);

  // Initialize path finder
  AStar.init(dungeon.m, isWallTile);

  // Create player
  var hero = EntityCreator.hero(dungeon.prev);

  // Create doors
  for (i = dungeon.d.length; i--;) {
    EntityCreator.door(dungeon.d[i]);
  }

  // Create enemies
  for (i = dungeon.e.length; i--;) {
    EntityCreator.bodyguard(dungeon.e[i]);
  }
}
