let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// Assignment Credits:
// Dalia De La Luz
// Graveyard Shift
// April 17, 2022
// Completion time: 4 days
// Point Breakdown:
// Display the time remaining (in seconds) on the screen (10)
// Create a new animated sprite for the Spaceship enemies (10)
// Create a new title screen (e.g., new artwork, typography, layout) (10)
// Implement parallax scrolling (10)
// Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
// With help from Eddie Alcaraz on implementing the timer