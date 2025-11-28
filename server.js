// imports
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const CurrentWord = require("./CurrentWord");

// setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);


// serve static files from /public
app.use(express.static('public'));



// game state
let players = {}; // { socket.id: {name, score} }
let submissions = []; // [ {playerId, word, score} ]


// handle socket connections
io.on('connection', (socket) => {
	console.log("connected user: ", socket.id);

	// player joins
	socket.on('joinGame', (name) => {
		players[socket.id] = { name, score: 0 };
		console.log(`joined player: ${name}`);
		io.emit('updatePlayers', players); // broadcast updated player list
	});
	// player disconnects
	socket.on('disconnect', () => {
		console.log(`disconnected player: ${socket.id}`);
		delete players[socket.id];
		io.emit('updatePlayers', players); // broadcast updated player list
	});


	// listen for word from client
	socket.on('submitWord', (word) => {
		const player = players[socket.id];
		if (!player) return; // safety check

		const prevWord = submissions.length > 0 ? submissions[submissions.length-1].word : "";
  		const currentWordObj = new CurrentWord(word, prevWord);
		console.log(JSON.stringify(currentWordObj, null, 2)); // output to server console

		const submission = {
			playerId: socket.id,
			// name: player.name,
			name: players[socket.id].name,
			// word,
			currentWordObj
		};
		submissions.push(submission);
		
		// update player score
		players[socket.id].score += currentWordObj.score;

		// send back to submitting player
		socket.emit('patternList', currentWordObj);

		// broadcast to all
		// socket.broadcast.emit('newSubmission', currentWordObj); // sending too much info
		io.emit('newSubmission', {
			name: players[socket.id].name,
			word: currentWordObj.word,
			score: currentWordObj.score
		});

		// update all player scores
		io.emit('updatePlayers', players);
	});


});


// scoring
function scoreWord(word) {
	return word.length * 3;
}


// start server
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
	console.log("server listening on port", PORT);
});
