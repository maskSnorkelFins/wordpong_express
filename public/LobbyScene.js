class LobbyScene extends Phaser.Scene {
	constructor(socket) {
		super('LobbyScene');
		this.socket = socket;
	}

	init() {
		// state
		this.playerName = "enter your name";

		// responsive design
		this.gameWidth = GAME_SETTINGS.gameWidth;
		this.gameWidthDIV2 = this.gameWidth/2;
		this.gameWidthDIV4 = this.gameWidth/4;
		this.gameHeight = GAME_SETTINGS.gameHeight;
		this.gameHeightDIV2 = this.gameHeight/2;
		this.gameHeightDIV4 = this.gameHeight/4;
	}

	preload() {
		// images
		this.load.image('library', './assets/images/library.jpg');
		this.load.image('pBox', './assets/images/playerBox_sm.png');
		// sounds
		this.load.audio('type0', './assets/sounds/type0.mp3');
		this.load.audio('type1', './assets/sounds/type1.mp3');
		this.load.audio('type2', './assets/sounds/type2.mp3');
		this.load.audio('type3', './assets/sounds/type3.mp3');
		this.load.audio('type4', './assets/sounds/type4.mp3');
		this.load.audio('type5', './assets/sounds/type5.mp3');
		this.load.audio('type6', './assets/sounds/type6.mp3');
		this.load.audio('type7', './assets/sounds/type7.mp3');
		this.load.audio('type8', './assets/sounds/type8.mp3');
		this.load.audio('type9', './assets/sounds/type9.mp3');
		this.load.audio('del0', './assets/sounds/del0.mp3');
		this.load.audio('del1', './assets/sounds/del1.mp3');
		this.load.audio('del2', './assets/sounds/del2.mp3');
		this.load.audio('del3', './assets/sounds/del3.mp3');
		this.load.audio('del4', './assets/sounds/del4.mp3');
		this.load.audio('enterMp3', './assets/sounds/enter.mp3');
	}

	create() {
		// socket
		this.socket.on('connect', () => {
			console.log(`connected: ${this.socket.id}`);
		});


		// sounds
		this.enterSound = this.sound.add('enterMp3');
		this.typeSounds = [];
		for (let i = 0; i <= 9; i++) {
			this.typeSounds.push(this.sound.add('type' + i));
		}
		this.prevTypeSound = this.typeSounds.length-1;
		this.delSounds = [];
		for (let i = 0; i <= 4; i++) {
			this.delSounds.push(this.sound.add('del' + i));
		}
		this.prevDelSound = this.delSounds.length-1;


		// images
		this.add.image(0, 0, 'library').setOrigin(0, 0) // coords based on 0,0 top left
		this.add.image(this.gameWidthDIV2, this.gameHeightDIV2, 'pBox');


		console.log(this.gameWidthDIV2, this.gameHeightDIV2);
		// this.playerNameInput = this.add.text(this.gameWidthDIV2, this.gameHeightDIV2, 'type to begin',
		// 	{ fontSize: '30px', fontFamily: "Arial", fill: '#000', backgroundColor: "#ccc", align: 'center' }
		// ).setOrigin(0.5, 0.5); // center-align text
		this.playerNameInput = this.add.bitmapText(this.gameWidthDIV2, this.gameHeightDIV2, 'typewriter', // font key
			"enter your name", 40).setOrigin(0.5, 0.5);


		// event listeners
		// keydown
		this.input.keyboard.on('keydown', (event) => this.handleKey(event.code));
	}

	update() {
		this.playerNameInput.setText(this.playerName); // set text
	}

	handleKey(code) {
		if (this.playerName === "enter your name") this.playerName = "";

		code = code.toLowerCase();
		console.log(`event.code: ${code}`);
		// console.log(`event.key: ${event.key}`);


		// if (code.startsWith('key') && code.length === 4) {
		if (code.startsWith('key') || code === 'space') {
			let rand;
			do {
				rand = Phaser.Math.Between(0, this.typeSounds.length - 1);
			} while (rand === this.prevTypeSound);
			this.prevTypeSound = rand;
			this.typeSounds[rand].play();
			if (code.startsWith('key')) {
				this.playerName += code.charAt(3);
			} else {
				this.playerName += " ";
			}
		} else if (code === 'backspace') {
			let rand;
			do {
				rand = Phaser.Math.Between(0, this.delSounds.length - 1);
			} while (rand === this.prevDelSound);
			this.prevDelSound = rand;
			this.delSounds[rand].play({ volume: 0.15 });
			this.playerName = this.playerName.slice(0, -1);
		} else if (code === 'enter') {
			this.enterSound.play({ volume: 0.1 });
			//
			socket.emit('joinGame', this.playerName);
			this.scene.start('GameScene');
			//
		}
	}
}