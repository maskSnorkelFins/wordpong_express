class GameScene extends Phaser.Scene {
	constructor(socket) {
		super('GameScene');
		this.socket = socket;
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
		this.propInput = "";
		this.scoreOutput;
		this.timeOutput;
		this.timer;
		this.chooseAPattern;

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
		this.load.image('table', './assets/images/table.jpg');
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
		this.socket.on('connect', () => {
			console.log(`connected: ${this.socket.id}`);
		});
		this.socket.on('updatePlayers', players => {
            console.log(players);
        });
		this.socket.on('patternList', currentWordObj => {
            console.log(currentWordObj);
			//
			//
			// convert currentWordObj into string array
			let patterns = Object.keys(currentWordObj);
			let bools = Object.values(currentWordObj);
			let patternsChoosable = [];

			for (let i = 2; i < bools.length; i++) {//patterns/bools arrays start at 2
				if (bools[i]
					//&& !usedPatterns[patterns[i]]
					//
					// CHECK IF PATTERN ALREADY USED
					//
					) {
					patternsChoosable.push(patterns[i]);
				}
			}
			//
			//
			this.chooseAPattern = true;
			this.showPatternBox(patternsChoosable);
        });

		// state
    	this.gameRunning = false;
		this.propWord = "";
		this.chooseAPattern = false;
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
		this.wordInput = this.add.text(this.gameWidthDIV2, this.gameHeightDIV2, 'type to begin',
			{ fontSize: '36px', fontFamily: 'Newsreader36', fill: '#000', align: 'center' }
		).setOrigin(0.5, 0.5); // center-align text
		// this.wordInput = this.add.bitmapText(this.gameWidthDIV2, this.gameHeightDIV2, 'typewriter', // font key
		// 	"type to begin", 40).setOrigin(0.5, 0.5);

		// this.scoreOutput = this.add.bitmapText(16, 16, 'typewriter',
		// 	"score: 0", 25).setTintFill(0xffffff);
		this.scoreOutput = this.add.text(16, 16, 'score: 0',
				{ fontSize: '24px', fontFamily: 'Newsreader24', align: 'center' }
			).setTintFill(0xffffff);

		// this.timeOutput = this.add.bitmapText(200, 16, 'typewriter',
		// 	"time: 0", 25).setTintFill(0xffffff);
		this.timeOutput = this.add.text(200, 16, 'time: 0',
				{ fontSize: '24px', fontFamily: 'Newsreader24', align: 'center' }
			).setTintFill(0xffffff);



		// pre-create graphics + text
		this.patternGraphic = this.add.graphics();
		this.patternText = this.add.text(0, 0, "", {
			fontSize: '24px',
			fontFamily: 'Newsreader24',
			color: '#fff',
			lineSpacing: 6,
			// wordWrap: { width: 300 }
		});
		// container
		this.patternContainer = this.add.container(0, 0, [
			this.patternGraphic,
			this.patternText
		]);
		this.patternContainer.setVisible(false);



		// event listeners
		// keydown
		this.input.keyboard.on('keydown', (event) => this.handleKey(event.code));
		// click
		// this.input.on('pointerdown', this.startGame, this);


		// trackpad
		// this.input.on('pointerdown', this.handlePointer, this);
		// this.cursors = this.input.keyboard.createCursorKeys();

		// keyup
		// this.input.keyboard.on('keyup', (event) => {
		// 	console.log(`key released: ${event.key}`);
		// });

	}



	update() {
		this.wordInput.setText(this.propWord); // set text
		this.scoreOutput.setText("score: " + this.score);
		this.timeOutput.setText("time: " + this.elapsedTime);

		// // check win/lose
		// if (this.propWord.length > 20) {
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
					this.timeOutput.setText("Time: " + this.elapsedTime);
				},
				callbackScope: this,
				loop: true
			});
		}
	}



	handleKey(code) {
		if (!this.gameRunning) this.startGame();

		if (this.propWord === "type to begin") this.propWord = "";


		code = code.toLowerCase();
		console.log(`event.code: ${code}`);
		// console.log(`event.key: ${event.key}`);

		if (this.chooseAPattern) {
			if (code.startsWith('digit')) {
				console.log(`\n\n${code.charAt(5)} pattern selected\n\n`);
				this.hidePatternBox();
				this.chooseAPattern = false;
				this.propWord = "";
			} else {
				//
				// add on-screen reminder to select a pattern
				//
				console.log("\n\nSELECT A PATTERN");
			}
		} else if (code.startsWith('key')) {
			let rand;
			do {
				rand = Phaser.Math.Between(0, this.typeSounds.length - 1);
			} while (rand === this.prevTypeSound);
			this.prevTypeSound = rand;
			this.typeSounds[rand].play();
			this.propWord += code.charAt(3);
		} else if (code === 'backspace') {
			let rand;
			do {
				rand = Phaser.Math.Between(0, this.delSounds.length - 1);
			} while (rand === this.prevDelSound);
			this.prevDelSound = rand;
			this.delSounds[rand].play({ volume: 0.15 });
			this.propWord = this.propWord.slice(0, -1);
		} else if (code === 'enter' || code === 'space') {
			this.enterSound.play({ volume: 0.1 });
			//
			socket.emit('submitWord', this.propWord);// EVALUATE WORD
			//
		}
		// else if (/^Key[A-Z]$/.test(code)) {
		// 	// console.log("ascii in alphabet range");
		// 	this.propWord += code.charAt(3).toLowerCase();
		// }
	}


	// slide up
	showPatternBox(patterns) {
		// const lines = patterns.join("\n");
		const lines = patterns.map((p, i) => `${i + 1}   ${p}`).join("\n");
		this.patternText.setText(lines);

		// measure text
		const padding = 20;
		const boxWidth = 300;
		const textBounds = this.patternText.getBounds();
		const boxHeight = textBounds.height + padding * 2;

		// redraw background
		this.patternGraphic.clear();
		this.patternGraphic.fillStyle(0x000000, 0.75);
		this.patternGraphic.fillRoundedRect(0, 0, boxWidth, boxHeight, 12);

		// position text inside box
		this.patternText.setPosition(padding, padding);

		// compute the right edge of the wordInput text
		const wordInputBounds = this.wordInput.getBounds();
		const spacing = 20; // space between wordInput and pattern box
		const finalX = wordInputBounds.right + spacing;
		const finalY = this.wordInput.y - boxHeight/2;

		// Start BELOW the screen
		const startY = this.gameHeight + 50;

		// Set starting position
		this.patternContainer.setX(finalX);
		this.patternContainer.setY(startY);
		this.patternContainer.setVisible(true);

		// animate upward
		this.tweens.add({
			targets: this.patternContainer,
			y: finalY,
			ease: "Cubic.easeOut",
			duration: 500
		});
	}
	// hide
	hidePatternBox() {
		this.tweens.add({
			targets: this.patternContainer,
			alpha: 0,
			duration: 200,
			onComplete: () => {
				this.patternContainer.setVisible(false);
				this.patternContainer.setAlpha(1);
			}
		});
	}

}