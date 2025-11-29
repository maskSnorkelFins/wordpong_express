class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	// init(data) { // GPT ADDED (DATA) AND THIS.SOCKET, THEN REMOVED – 20251128
		// socket
		// this.socket = data.socket;
	init() {
		this.player;
		this.gameRunning = false;
		this.propWord = "";
		this.score = 0;
		this.elapsedTime = 0;
		this.propText = "";
		this.scoreText = "Score: 0";
		this.timeText = "Time: 0";
		this.timer;

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
		this.load.image('table', 'assets/images/table.jpg');
		this.load.image('pBox', './assets/images/playerBox_sm.png');
		this.load.image('oBox1', './assets/images/opponentBox_sm.png');
		this.load.image('oBox2', './assets/images/opponentBox_sm.png');
		this.load.image('oBox3', './assets/images/opponentBox_sm.png');
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
		this.socket = window.socket;
		if (!this.socket) {
			console.log("socket not defined!");
			return;
		}
		this.socket.on('updatePlayers', players => {
            console.log(players);
        });

		// state
    	this.gameRunning = false;
		this.propWord = "";
		this.score = 0;
		this.elapsedTime = 0;


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
		this.add.image(0, 0, 'table').setOrigin(0, 0) // coords based on 0,0 top left
		this.add.image(this.gameWidthDIV2, this.gameHeightDIV2, 'pBox');
		this.add.image(this.gameWidthDIV2-this.gameWidthDIV4, 150, 'oBox1');
		this.add.image(this.gameWidthDIV2, 75, 'oBox2');
		this.add.image(this.gameWidthDIV2+this.gameWidthDIV4, 150, 'oBox3');


		// text
		console.log(this.gameWidthDIV2, this.gameHeightDIV2);
		// this.propText = this.add.text(this.gameWidthDIV2, this.gameHeightDIV2, 'type to begin',
		// 	{ fontSize: '30px', fontFamily: "Arial", fill: '#000', backgroundColor: "#ccc", align: 'center' }
		// ).setOrigin(0.5, 0.5); // center-align text
		this.propText = this.add.bitmapText(this.gameWidthDIV2, this.gameHeightDIV2, 'typewriter', // font key
			'type to begin', 40).setOrigin(0.5, 0.5);

		// this.scoreText = this.add.text(16, 16, 'Score: ' + this.score,
		// 	{ fontSize: '20px', fontFamily: "Arial", fill: '#000' }
		// );
		this.scoreText = this.add.bitmapText(16, 16, 'typewriter',
			'Score: 0', 25).setTintFill(0xffffff);

		// this.timeText = this.add.text(200, 16, "Time: 0",
		// 	{ fontSize: '20px', fontFamily: "Arial", fill: '#000' }
		// );
		this.timeText = this.add.bitmapText(200, 16, 'typewriter',
			'Time: 0', 25).setTintFill(0xffffff);



		// event listeners
		// keydown
		this.input.keyboard.on('keydown', (event) => this.handleKey(event.code));
		// click
		this.input.on('pointerdown', this.startGame, this);


		// trackpad
		// this.input.on('pointerdown', this.handlePointer, this);
		// this.cursors = this.input.keyboard.createCursorKeys();

		// keyup
		// this.input.keyboard.on('keyup', (event) => {
		// 	console.log(`key released: ${event.key}`);
		// });

	}



	update() {
		// this.propText.setText(this.currentTypedChars);
		this.propText.setText(this.propWord); // set text
		this.scoreText.setText("Score: " + this.score);
		this.timeText.setText("Time: " + this.elapsedTime);

		// // check win/lose
		// if (this.currentTypedChars.length > 20) {
		// 	this.endGame();
		// }
	}



	startGame() {
		console.log("this is startGame()");
		if (!this.gameRunning) {
			this.gameRunning = true;
			// document.body.style.cursor = 'none'; // hide pointer arrow

			// resets
			this.score = 0;
			this.propWord = ("");

			// track time
			this.elapsedTime = 0;
			this.timer = this.time.addEvent({
				delay: 1000,
				callback: () => {
					this.elapsedTime++;
					this.timeText.setText("Time: " + this.elapsedTime);
				},
				callbackScope: this,
				loop: true
			});
		}
	}



	handleKey(code) {
		if (!this.gameRunning) return;

		code = code.toLowerCase();
		console.log(`event.code: ${code}`);
		// console.log(`event.key: ${event.key}`);


		// if (code.startsWith('key') && code.length === 4) {
		if (code.startsWith('key')) {
			let rand;
			do {
				rand = Phaser.Math.Between(0, this.typeSounds.length - 1);
			} while (rand === this.prevTypeSound);
			this.prevTypeSound = rand;
			this.typeSounds[rand].play();

			this.currentTypedChars += code.charAt(3);
			this.propWord += code.charAt(3); // NECESSARY?
		} else if (code === 'backspace') {
			let rand;
			do {
				rand = Phaser.Math.Between(0, this.delSounds.length - 1);
			} while (rand === this.prevDelSound);
			this.prevDelSound = rand;
			this.delSounds[rand].play({ volume: 0.15 });

			this.currentTypedChars = this.currentTypedChars.slice(0, -1);
			this.propWord = this.propWord.slice(0, -1); // NECESSARY?
		} else if (code === 'enter' || code === 'space') {
			this.enterSound.play({ volume: 0.1 });
			//
			socket.emit('submitWord', this.propWord);// EVALUATE WORD
			//
			this.propWord = "";
		}
		// else if (/^Key[A-Z]$/.test(code)) {
		// 	// console.log("ascii in alphabet range");
		// 	this.propWord += code.charAt(3).toLowerCase();
		// }
	}

}