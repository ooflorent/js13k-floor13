// Globals
// -------

// Game managers
var __evt = new EventManager();
var __em = new EntityManager(__evt);
var __sm = new SystemManager(__evt);

// Rendering engine
var __buffer = new Buffer($('c'), __PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE);
var __textureManager = new TextureManager();


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

function runGame() {
  var gameScreen;

  __textureManager.l(__PW_ASSETS_DIR + 't.png', function() {
    console.log('Go go go!');

  });
}
