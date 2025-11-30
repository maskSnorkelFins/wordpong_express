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
		this.scene.start('LobbyScene');
    }
}