let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let shoot, keyR, keyA, keyD;

let highscore = 0;

// High Score (5)
// Fire UI text (5)
// Scrolling Tile Sprite for background (5) - Implemented as part of parallax scrolling
// New Title Screen (10)
// Implemented parallax scrolling (10)
// Created new smaller spaceship type (20)
// Created new artwork for all in game assets (20)
// Created and implemented new weapon w/new behavior and graphics (20) - New bahvior is that it does not move, but the laser beam moves very fast, making the game more reaction based
// Total: 95