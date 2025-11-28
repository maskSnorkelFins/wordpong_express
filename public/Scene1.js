// GPT REWRITE 20251128
class Scene1 extends Phaser.Scene {
    constructor() {
        super('bootGame');
    }

    // init(data) { // GPT ADDED, THEN REMOVED IN FAVOR OF WINDOW.SOCKET – 20251128
    //     // receive socket if passed here; optional if Scene1 doesn't use it
    //     // this.socket = data?.socket;
	// 	this.socket = data.socket;
    // }

    create() {
        this.add.text(20, 20, "Loading game ...");

        // start Scene2 and pass the shared socket
        // this.scene.start('playGame', { socket: this.socket });
		// this.scene.start('playGame', { socket: this.socket || window.socket }); // GPT SUGGESTION 20251128
    }
}


// FIRST VERSION
// class Scene1 extends Phaser.Scene {
// 	constructor() {
// 		super('bootGame');
// 	}

// 	create() {
// 		this.add.text(20, 20, "Loading game ...");
// 		this.scene.start('playGame');
// 	}
// }