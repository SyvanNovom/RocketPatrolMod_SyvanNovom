class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Trebuchet',
            fontSize: '38px',
            backgroundColor: '#610C04',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Welcome to', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '28px';
        this.add.text(game.config.width/2, game.config.height/2, 'Use Left Click to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#FFA701';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*2, 'Press A for Novice or D for Expert', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'HIGH SCORE: ' + highscore, menuConfig).setOrigin(0.5);

        // define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyA)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyD)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 6,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}