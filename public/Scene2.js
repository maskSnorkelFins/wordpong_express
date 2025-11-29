class Scene2 extends Phaser.Scene {
	constructor() {
		super('playGame');
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
		this.load.image('table', 'assets/table.jpg');
		this.load.image('pBox', './assets/playerBox_sm.png');
		this.load.image('oBox1', './assets/opponentBox_sm.png');
		this.load.image('oBox2', './assets/opponentBox_sm.png');
		this.load.image('oBox3', './assets/opponentBox_sm.png');
		// sounds
		// this.load.audio('newball', './assets/newball.mp3');
		// this.load.audio('dead', '/.assets/dead.mp3');
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
		// this.newballSound = this.sound.add('newball');
		// this.deadSound = this.sound.add('dead');

		
		// images
		this.add.image(0, 0, 'table').setOrigin(0, 0) // coords based on 0,0 top left
		this.add.image(this.gameWidthDIV2, this.gameHeightDIV2, 'pBox');
		this.add.image(this.gameWidthDIV2-this.gameWidthDIV4, 150, 'oBox1');
		this.add.image(this.gameWidthDIV2, 75, 'oBox2');
		this.add.image(this.gameWidthDIV2+this.gameWidthDIV4, 150, 'oBox3');


		// text
		console.log(this.gameWidthDIV2, this.gameHeightDIV2);
		this.propText = this.add.text(this.gameWidthDIV2, this.gameHeightDIV2, 'type to begin',
			{ fontSize: '30px', fontFamily: "Arial", fill: '#000', backgroundColor: "#ccc", align: 'center' }
		).setOrigin(0.5, 0.5); // center-align text
		this.scoreText = this.add.text(16, 16, 'Score: ' + this.score,
			{ fontSize: '20px', fontFamily: "Arial", fill: '#000' }
		);
		this.timeText = this.add.text(200, 16, "Time: 0",
			{ fontSize: '20px', fontFamily: "Arial", fill: '#000' }
		);


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
			this.currentTypedChars += code.charAt(3);
			this.propWord += code.charAt(3); // NECESSARY?
		} else if (code === 'backspace') {
			this.currentTypedChars = this.currentTypedChars.slice(0, -1);
			this.propWord = this.propWord.slice(0, -1); // NECESSARY?
		} else if (code === 'enter' || code === 'space') {
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