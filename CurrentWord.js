// NECESSARY?
const { score, cvPattern, tallyDoubles, tallySingleTriples, weighCV, streak, checkSubsets, 
        alternating, wrappedCV, tallHang, palindrome, centerLetter } = require('./eval');


function CurrentWord(word, prev) {
	if (!prev) prev = "";
	// console.log("\n\nprev: " + prev + "\ncurr: " + word);
	console.log(`\n\nprev: ${prev}\ncurr: ${word}`);

	// stats
	this.word = word;
	this.score = score(word);
	console.log("word score: " + this.score);


	// consonant/vowel pattern
	this.cvPattern = cvPattern(word);//0 bananas
	// // y consonant or vowel?
	// this.yConsonant = yConsonant(word);//0 tryst, funny


	// length
	this.length = word.length;//1 cat
	this.lengthEven = (word.length % 2 == 0);//2 dead
	this.lengthOdd = !this.lengthEven;//3 alive


	// doubles & doubles x 2
	const doublesTallies = tallyDoubles(word, this.cvPattern);
	this.doubleConsonant = doublesTallies[0];//4 llama, bell  -gayyou
	this.doubleVowel = doublesTallies[1];//5 aardvark, spree  -gayyou
	this.double2Consonants = doublesTallies[2];//6 grasshopper
	this.double2Vowels = doublesTallies[3];//7 voodoo
	// triples & no repeats
	const singleTripleTallies = tallySingleTriples(word, this.cvPattern);
	this.same3Consonants = singleTripleTallies[0];//8 babble
	this.same3Vowels = singleTripleTallies[1];//9 bikini
	this.noRepeats = singleTripleTallies[2];//10 depth

	
	// balance
	const cvTallies = weighCV(word, this.cvPattern);
	this.mostlyCons = cvTallies[0];//11 cannon
	this.mostlyVows = cvTallies[1];//12 adieu
	this.balancedConsVows = cvTallies[2];//13 abacus
	// streak
	const cvStreak = streak(word, this.cvPattern);
	this.streakConsonants = cvStreak[0];//14 strength
	this.streakVowels = cvStreak[1];//15 adieu


	//subsets
	const subsetTallies = checkSubsets(word, this.cvPattern);
	this.allFrequentConsonants = subsetTallies[0];//16 slant
	this.allInfrequentConsonants = subsetTallies[1];//17 jazzy
	this.allAlphaStart = subsetTallies[2];//18 milk
	this.allAlphaEnd = subsetTallies[3];//19 spoon
	this.allKeyboardLeft = subsetTallies[4];//20 street
	this.allKeyboardRight = subsetTallies[5];//21 loony

	//alternating
	const alternates = alternating(word, this.cvPattern);
	this.alternatingCV = alternates[0];//22 seven
	this.alernatingKeyboard = alternates[1];//23 risk, pale
	this.alternatingTallShort = alternates[2];//24 take, elite
	this.alternatingHangShort = alternates[3];//25 page, agape

	//wraps
	const wrappedConsVows = wrappedCV(word, this.cvPattern);
	this.wrappedConsonants = wrappedConsVows[0];//26 land
	this.wrappedVowels = wrappedConsVows[1];//27 alto
	this.wrappedSameConsonant = wrappedConsVows[2];//28 gang
	this.wrappedSameVowel = wrappedConsVows[3];//29 ease

	//heights
	const tallsHangs = tallHang(word);
	this.startsTall = tallsHangs[0];//30 ban
	this.endsTall = tallsHangs[1];//31 end
	this.startsHang = tallsHangs[2];//32 gun
	this.endsHang = tallsHangs[3];//33 sang
	this.wrappedTall = tallsHangs[4];//34 tall
	this.wrappedHang = tallsHangs[5];//35 gang
	this.allShorts = tallsHangs[6];//36 ease

	//challenge
	this.palindrome = palindrome(word);//37 kayak, pullup
	this.center = centerLetter(word, prev);//38 level, civil

	// begins w/ 2 consonants 39
	// begins w/ 2 vowels 40
	// only 1 consonant (if repeated) 41
	// only 1 vowel (if repeated) 42
	// only 2 consonants/vowels (if 4 or more letters) 43
	// ends w/ 2 consonants 44
	// ends w/ 2 vowels 45
	// startsSameLtr 46
	// endsSameLtr 47
	// startsNextLtr 48
	// startsPrevLtr 49
	// begins w/ same consonant 50
	// begins w/ same vowel 51
	// ends w/ same consonant 52
	// ends w/ same vowel 53
	// begins w/ same 2 letters 54
	// ends w/ same 2 letters 55

}

module.exports = CurrentWord;