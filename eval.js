// SOME PATTERNS NEED AT LEAST 4 LETTERS
// SUCH AS ALTERNATE C/V


// letter lists
{
const VOWELS = "aeiou";
const VOWELS_WITH_Y = "aeiouy";
const CONSONANTS = "bcdfghjklmnpqrstvwxyz";
const CONSONANTS_NO_Y = "bcdfghjklmnpqrstvwxz";
const FREQUENTS = "rtnslcdpmh";
const INFREQUENTS = "gbfywkvxzjq";
const ALPHA_START = "abcdefghijklm";
const ALPHA_END = "nopqrstuvwxyz";
const KEYBOARD_LEFT = "qwertasdfgzxcvb";
const KEYBOARD_RIGHT = "yuiophjklnm";
const TALLS = "bdfhklt";
const HANGS = "gjpqy";
const SHORTS = "aceimnorsuvwxz";
}

// create boolean array for consonant(true) / vowel(false)
function cvPattern(word) {
	const cvBooleans = [];
	for (let i = 0; i < word.length; i++) {
		if (word[i] == 'y') {// is y consonant or vowel?
			if (i < word.length-1) {// evaluate y
				cvBooleans.push(yConsonant(word, i));
			} else {// final y = vowel
				cvBooleans.push(false);
			}
		} else if (VOWELS.includes(word[i])) {//false = vowel
			cvBooleans.push(false);
		} else {//true = consonant
			cvBooleans.push(true);
		}
	}
	return cvBooleans;
}


// determine if "y" is vowel or consonant
function yConsonant(word, i) {
	let consoY = false;
	if (VOWELS.includes(word[i+1])) {
		consoY = true;
		if (word.slice(i+1, i+4) == "ing") {// for "-ying-"
			consoY = false;
		}
	}
	return consoY;
	// consonant: year, yellow, yes, young, beyond, lawyer
	// vowel: frying, undying, annoyingly, candy, monkey, myth, bicycle
		// pylon, tyrant, dynamite, system, typical, pyramid, toy, day, mystery
}


// stats
function score(word) {
	let sc = 0;
	for (let i = 0; i < word.length; i++) {
		sc += word.charCodeAt(i) - 96;
	}
	return sc;
}


// repeats 4 5 6 7 8 9 10
function tallyDoubles(word, cvBools) {
	const results = [false,false,false,false];
	let tallyCon = 0;
	let tallyVow = 0;

	// loop thru word
	for (let i = 0; i < word.length - 1; i++) {
		// detect repeat letters
		if (word[i] == word[i + 1]) {
			if (cvBools[i] && cvBools[i+1]) {
				results[0] = true;//double consonant
				tallyCon++;
			} else if (!cvBools[i] && !cvBools[i+1]) {
				results[1] = true;//double vowel
				tallyVow++;
			}
		}
	}
	results[2] = tallyCon > 1;//double consonant x2
	results[3] = tallyVow > 1;//double vowel x2
	return results;
}
function tallySingleTriples(word, cvBools) {
	const results = [];
	results[2] = true;//assume all letters unique
	let letterSet = "";

	// declare dictionaries
	let hashmapCons = {
		count: 0
	}
	let hashmapVows = {
		count: 0
	}

	// set all key/value pairs to 0
	for (let i = 0; i < CONSONANTS.length; i++) {
		hashmapCons[CONSONANTS[i]] = 0;
	}
	for (let i = 0; i < VOWELS_WITH_Y.length; i++) {
		hashmapVows[VOWELS_WITH_Y[i]] = 0;
	}

	// loop thru word
	for (let i = 0; i < word.length; i++) {
		if (!letterSet.includes(word.charAt(i))) {
			letterSet += word.charAt(i);
		} else {
			results[2] = false;//not all letters unique, duplicate found
		}

		// tally all consonants
		if (CONSONANTS.includes(word.charAt(i)) && cvBools[i]) {
			hashmapCons[word.charAt(i)]++;
		}
		// tally all vowels
		if (VOWELS_WITH_Y.includes(word.charAt(i)) && !cvBools[i]) {
			hashmapVows[word.charAt(i)]++;
		}
	}

	// report 3 consonants
	let count = 0;
	for (let key in hashmapCons) {
		count = hashmapCons[key];
		if (count > 2) {
			break;
		}
	}
	results[0] = count > 2;
	// report 3 vowels
	count = 0;
	for (let key in hashmapVows) {
		count = hashmapVows[key];
		if (count > 2) {
			break;
		}
	}
	results[1] = count > 2;
	return results;
}


// balance 11 12 13
function weighCV(word, cvBools) {
	const results = [false,false,false];
	let tallyCon = 0;
	let tallyVow = 0;

	for (let i = 0; i < cvBools.length; i++) {
		if (cvBools[i]) {
			tallyCon++;
		} else {
			tallyVow++;
		}
	}
	results[0] = tallyCon > tallyVow;
	results[1] = tallyCon < tallyVow;
	results[2] = tallyCon == tallyVow;
	return results;
}


// streak 14 15
function streak(word, cvBools) {
	const results = [false,false];
	let countCons, streakCons = 0;
	let countVows, streakVows = 0;

	for (let i = 0; i < cvBools.length; i++) {
		if (cvBools[i]) {
			// consonant logic
			countCons++;
			if (i == word.length - 1) {//end of word
				if (countCons > streakCons) {
					streakCons = countCons;
				}
			}
			
			// vowel logic
			if (countVows > streakVows) {
				streakVows = countVows;
			}
			countVows = 0;

		} else {//streak is over, continue checking
			// consonant logic
			if (countCons > streakCons) {
				streakCons = countCons;
			}
			countCons = 0;
			
			// vowel logic
			countVows++;
			if (i == word.length - 1) {//end of word
				if (countVows > streakVows) {
					streakVows = countVows;
				}
			}
		}
	}
	results[0] = countCons > 2;//report consonant streak
	results[1] = countVows > 2;//report vowel streak
	return results;
}


// subsets 16 17 18 19 20 21 22
function checkSubsets(word, cvBools) {
	const results = [true,true,true,true,true,true];
	for (let i = 0; i < word.length; i++) {
		if (cvBools[i]) {// letter is consonant
			if (!FREQUENTS.includes(word[i])) {// all frequents
				results[0] = false;
			}
			if (!INFREQUENTS.includes(word[i])) {// all infrequents
				results[1] = false;
			}
		}
		if (!ALPHA_START.includes(word[i])) {// all first half alphabet
			results[2] = false;
		}
		if (!ALPHA_END.includes(word[i])) {// all second half alphabet
			results[3] = false;
		}
		// all keyboard left
		if (!KEYBOARD_LEFT.includes(word[i])) {// letter on keyboard RIGHT
			results[4] = false;// not all keyboard left
		}
		// all keyboard right
		if (!KEYBOARD_RIGHT.includes(word[i])) {// letter on keyboard LEFT
			results[5] = false;// not all keyboard right
		}
	}
	return results;
}


// wraps 23 24 25 26
function wrappedCV(word, cvBools) {
	const results = [false,false,false,false];
	results[0] = cvBools[0] && cvBools[cvBools.length - 1];// wrapped consonant
	results[1] = !cvBools[0] && !cvBools[cvBools.length - 1];// wrapped vowel
	if (word[0] == word[word.length-1]) {
		results[2] = results[0]; // wrapped same consonant
		results[3] = results[1];// wrapped same vowel
	}
	return results;
}


// tall hang 27 28 29 30 31 32 33
function tallHang(word){
	const results = [false,false,false,false,false,false,true];
	results[0] = TALLS.includes(word[0]);// starts tall
	results[1] = TALLS.includes(word[word.length-1]);// ends tall
	results[2] = HANGS.includes(word[0]);// starts hang
	results[3] = HANGS.includes(word[word.length-1]);// ends hang
	results[4] = TALLS.includes(word[0]) && TALLS.includes(word[word.length-1]);// wrapped tall
	results[5] = HANGS.includes(word[0]) && HANGS.includes(word[word.length-1]);// wrapped hang
	for (let i = 0; i < word.length - 1; i++) {
		if (!SHORTS.includes(word[i])) {
			results[6] = false;// all shorts false;
			break;
		}
	}
	return results;
}


// alternating 33 34 35 36
function alternating(word, cvBools) {
	const results = [true,true,true, true];

	for (let i = 0; i < cvBools.length-1; i++) {
		if (cvBools[i] == cvBools[i+1]) {// consonants/vowels in a row
			results[0] = false;
		}
	}
	for (let i = 0; i < word.length-1; i++) {
		if (// left/right keyboard in a row
			!(KEYBOARD_LEFT.includes(word[i]) && KEYBOARD_RIGHT.includes(word[i + 1]))
			&& !(KEYBOARD_RIGHT.includes(word[i]) && KEYBOARD_LEFT.includes(word[i + 1]))
		) {
			results[1] = false;
		}
		if (// talls/shorts in a row
			!(TALLS.includes(word[i]) && SHORTS.includes(word[i + 1]))
			&& !(SHORTS.includes(word[i]) && TALLS.includes(word[i + 1]))
		) {
			results[2] = false;
		}
		if (// hangs/shorts in a row
			!(HANGS.includes(word[i]) && SHORTS.includes(word[i + 1]))
			&& !(SHORTS.includes(word[i]) && HANGS.includes(word[i + 1]))
		) {
			results[3] = false;
		}
	}
	return results;
}


// ADD ALL LONG PALINDROMES TO WORDS.TXT
// palindrome 37
function palindrome(word) {
	for (let i = 0; i < Math.round(word.length/2); i++) {
		if (word[i] != word[word.length - 1 - i]) {
			return false;
		}
	}
	return true;
}


// center 38
function centerLetter(word, prev) {
	if (word.length % 2 == 1 && prev.length % 2 == 1) {
		if (word[(word.length-1) / 2] == prev[(prev.length-1) / 2]) {
			return true;
		}
	}
	return false;
}


module.exports = {
  cvPattern,
  yConsonant,
  score,
  tallyDoubles,
  tallySingleTriples,
  weighCV,
  streak,
  checkSubsets,
  wrappedCV,
  tallHang,
  alternating,
  palindrome,
  centerLetter
};