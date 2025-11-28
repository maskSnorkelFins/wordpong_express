// connect to server
const socket = io();
let myName = "";
document.getElementById('nameInput').focus();


// join game
document.getElementById('nameInput').addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		const name = document.getElementById('nameInput').value.trim();
		if (!name) return alert("enter your name");
		//
		// --- SUBMIT NAME TO SERVER --- //
		//
		myName = name;
		socket.emit('joinGame', name);
		document.getElementById('nameDiv').style.display = "none";
		document.getElementById('gameDiv').style.display = "block";
		document.getElementById('wordInput').focus();
	}
});


// submit word
document.getElementById('wordInput').addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		const word = document.getElementById('wordInput').value.toLowerCase().trim();
		if (!word) return;
		//
		// --- SUBMIT WORD TO SERVER --- //
		//
		socket.emit('submitWord', word);
		document.getElementById('wordInput').value = "";
		document.getElementById('wordInput').focus();
	}
});


// update player list
socket.on('updatePlayers', (players) => {
	const ul = document.getElementById('players');
	ul.innerHTML = "";
	for (let id in players) {
		const li = document.createElement('li');
		li.textContent = `${players[id].name}: ${players[id].score} pts`;
		ul.appendChild(li);
	}
});


// player receives pattern list
socket.on('patternList', (submission) => {
	// display word
	document.getElementById('wordDisplay').textContent = `${submission.word}`;

	const ul = document.getElementById('patternList');
	ul.innerHTML = ""; // clear previous patterns

	// filter to patterns with true values
	const truePatterns = Object.keys(submission).filter(key => {
		return !['word', 'score', 'name', 'playerId'].includes(key) && submission[key] === true;
	});

	// display patterns
	truePatterns.forEach(pattern => {
		const li = document.createElement('li');
		li.textContent = pattern;
		ul.appendChild(li);
	});
	ul.scrollTop = ul.scrollHeight;
});


// show word log
// socket.on('newSubmission', (submission) => {
// 	const ul = document.getElementById('wordLog');
// 	// const li = document.createElement('li');
// 	// li.textContent = `${submission.name} submitted "${submission.word}" → ${submission.score} pts`;
// 	// ul.appendChild(li);
// });
let submittedWords = [];

// show word log
socket.on('newSubmission', (submission) => {
    submittedWords.push(submission.word);

    // sort alphabetically (case-insensitive)
    submittedWords.sort((a, b) => a.localeCompare(b));

    const ul = document.getElementById('wordLog');
    ul.innerHTML = ""; // clear the list

    submittedWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        ul.appendChild(li);
    });
});