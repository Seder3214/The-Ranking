let modInfo = {
	name: "The Ranking",
	author: "seder3214",
	pointsName: "points",
	modFiles: ["layers/rp.js","layers/a.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.04",
	name: "The Ranking",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1.0.4</h3><br>
		- Fixed several automation bugs.
		- Changed layer components style.
	<h3>v0.1.0.3</h3><br>
		- Reduced the cost of [ Ranking XVII ] upgrade (3e269 -> 3e261)
		- Reduced the 2nd Rankings effect softcap increase while in [ Rankings UnLimited ] challenge (0.325 -> 0.225)
		- Also fixed 2nd Ranking's autobuyer not working while in challenges.
		- Removed the 'stars' typo! (The Event Tree forking moment, lol)
		- Fixed the bug when automation stops when Ranking meet the req for hex up before unlocking it with an upgrade.
		- Fixed the bug when you can get restricted rankings in [ Rankings UnLimited ] challenge by holding on them
		- Changed the row of Ranking Points for a new layer.
		- Changed the overall font.
		- Fixed the hardlock when performing RP reset.
	<h3>v0.1</h3><br>
		- Added Rankings Layer.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (player.rp.grid[101].tier>=1) gain=gain.add(tmp.rp.getBoosterEff)
	//gain = gain.mul(getCrystalsEffect('normal'))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}