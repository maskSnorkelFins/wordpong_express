// open socket connection
const socket = io();
window.socket = socket; // GPT ADDED 20251128, FIGURE OUT HOW TO PASS SOCKET AS SCENE DATA


const GAME_SETTINGS = {
	gameWidth: window.innerWidth,
	gameHeight: window.innerHeight,
};
console.log(`Window ${GAME_SETTINGS.gameWidth} x ${GAME_SETTINGS.gameHeight}`);

var config = {
	type: Phaser.AUTO, //Phaser.WEBGL, or Phaser.CANVAS if WEBGL not available
	width: GAME_SETTINGS.gameWidth,
	height: GAME_SETTINGS.gameHeight,
	backgroundColor: 0xbe9369, // coffee
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 0 },
			debug: false,
			fps: 60,
			timeScale: 1,
			// useTree: true, // spatial partitioning
			// maxVelocity: 10000,
			// overlapBias: 8, // collision separation, default = 4
			// steps: 2 // improves accuracy, default = 1
		}
	},
	scene: [Scene1, Scene2]
};

// instantiate game
const game = new Phaser.Game(config);