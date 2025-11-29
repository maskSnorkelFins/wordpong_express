// GPT REWRITE 20251128
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

	preload() {
		this.load.bitmapFont(
			'typewriter',
			'assets/fonts/typewriter.png',
			'assets/fonts/typewriter.fnt'
		);
	}

	create() {
        this.add.text(20, 20, "Loading game ...");
		this.scene.start('GameScene');

		// start Scene2 and pass the shared socket – GPT SUGGESTION 20251128
        // this.scene.start('playGame', { socket: this.socket });
		// this.scene.start('playGame', { socket: this.socket || window.socket });
    }
}