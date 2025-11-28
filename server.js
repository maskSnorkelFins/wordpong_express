// imports
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

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
		//
		// reject words longer than N characters (30?)
		//
		// track room.currentPlayerId
		// reject submissions from anyone else
		// if (socket.id !== room.currentPlayerId) return reject();
		//
		// server rate limiting – 1 submission every X seconds, reject on spam
		// timestamp each turn to prevent “clock rewinding” attempts
		//
		// only broadcast words after they are finalized
		//
		// 
		//
		const player = players[socket.id];
		if (!player) return; // safety check

		const wordScore = scoreWord(word);
		player.score += wordScore;

		const submission = {
			playerId: socket.id,
			name: player.name,
			word,
			score: wordScore
		};
		submissions.push(submission);

		io.emit('newSubmission', submission); // broadcast submission to all clients
		io.emit('updatePlayers', players); // broadcast updated player scores
		// socket.emit('scoreResult', { word, score }); // send result back to client
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
