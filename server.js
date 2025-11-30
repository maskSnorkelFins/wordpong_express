// setup express server
const express = require('express');
const app = express();

const http = require('http').createServer(app); // CHANGED 20251128
const { Server } = require('socket.io');
const io = require('socket.io')(http); // CHANGED 20251128

const fs = require('fs/promises'); // for loading words.txt
const path = require('path');

const CurrentWord = require("./CurrentWord");



// serve static files from /public
app.use(express.static('public'));



// dictionary
const DICTIONARY = new Set();
(async () => {
	await loadDictionary();
	console.log(`${DICTIONARY.size} words loaded`);
	
	// validation
	console.log("Loaded words:", DICTIONARY.size);
	console.log("First 10 words:", Array.from(DICTIONARY).slice(0,10));
	console.log("Does 'cat' exist?", DICTIONARY.has("cat"));
})();


// game state
const players = {}; // { socket.id: {name, score} }
const submissions = []; // [ {playerId, word, score} ]


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

		console.log("socket.on('submitWord') passed the safety check");
		if (!DICTIONARY.has(word.toLowerCase())) {
			console.log(`${word} NOT IN DICTIONARY`);
			return;
		} else {
			console.log(`${word} in dictionary`);
		}

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


// // scoring
// function scoreWord(word) {
// 	return word.length * 3;
// }


async function loadDictionary() {
	const filePath = path.join(__dirname, 'words.txt');
	const text = await fs.readFile(filePath, 'utf8');
	for (const line of text.split("\n")) {
		const word = line.replace(/^\uFEFF/, '') // remove BOM (byte order mark)
			.split(',')[0] // remove comma + column
			.replace(/\r/g, '') // remove carriage return
			.trim()
			.toLowerCase();
		if (word) DICTIONARY.add(word);
	}
}


// start server
const PORT = process.env.PORT || 3030;
http.listen(PORT, () => console.log('Server running on port 3030'));
