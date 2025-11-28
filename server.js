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


// handle socket connections
io.on('connection', (socket) => {
	console.log("connected user: ", socket.id);

	// listen for word from client
	socket.on('submitWord', (word) => {
		const score = scoreWord(word);
		socket.emit('scoreResult', { word, score }); // send result back to client
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
