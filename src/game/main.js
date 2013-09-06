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
var __buffer = new Buffer($('c'), __PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE);
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
var GROUP_DASHES = 4;


// Textures and animations
// -----------------------

// World tiles
__textureManager.s('r', 0, 0, 16, 16);     // Roof
__textureManager.s('w', 0, 16, 16, 16);    // North wall
__textureManager.s('f', 0, 32, 16, 16);    // Floor
__textureManager.s('sd', 88, 0, 16, 16);   // Down stairs
__textureManager.s('su', 89, 17, 15, 22);  // Up stairs
__textureManager.s('dh', 110, 0, 16, 17);  // Horizontal door
__textureManager.s('dv', 104, 0, 6, 28);   // Vertical door

// Mobs
__textureManager.s('p', 16, 0, 9, 10, 8);  // Player
__textureManager.s('s', 16, 10, 9, 10, 8); // Skeleton

// Effects
__textureManager.s('d', 62, 40, 7, 7, 3); // Dash

// Animations
__textureManager.d('_n', [5]);          // Idle north
__textureManager.d('_h', [0]);          // Idle west or east
__textureManager.d('_s', [2]);          // Idle south
__textureManager.d('n', [7, 6], 6);     // Walking north
__textureManager.d('h', [1, 0], 8);     // Walking west or east
__textureManager.d('s', [4, 3], 6);     // Walking south
__textureManager.d('d', [0, 1, 2], 12); // Dash


// Game runner
// -----------

/**
 * Start the game.
 */
function runGame() {
  // Load the main spritesheet
  __textureManager.l(__PW_ASSETS_DIR + 't.png', function onLoad() {
    // Intialize the game
    //initializeGame();

    // Start the ticker
    //__ticker.start(gameLoop);
  });
}

/**
 * Process the current tick.
 * @param  {float} elapsed
 */
function gameLoop(elapsed) {
  __sm.u(elapsed);
  __buffer.r();
}


// Game initialization
// -------------------

function initializeGame() {
  // Create game layers
  var stage = new Stage();
  var cameraLayer = stage.add(new DisplayObjectContainer());
  var hudLayer    = stage.add(new DisplayObjectContainer());
  var gameLayer   = cameraLayer.add(new DisplayObjectContainer());
  var debugLayer  = __PW_DEBUG ? cameraLayer.add(new DisplayObjectContainer()) : null;

  // Create game systems
  __sm.a(new KeyboardControlSystem());
  __sm.a(new PathFollowSystem());
  __sm.a(new MovementSystem());
  __sm.a(new CollisionSystem());
  __sm.a(new CameraSystem(cameraLayer));
  __PW_DEBUG && __sm.a(new BoundsRenderingSystem(debugLayer));
  __sm.a(new SpriteDirectionSystem());
  __sm.a(new RenderingSystem(gameLayer));
  __sm.a(new ExpirationSystem());
}
