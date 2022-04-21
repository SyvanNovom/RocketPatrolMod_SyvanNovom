var timer = 60000
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/LaserBeam.png');
        this.load.image('laser', './assets/laser.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('smallship', './assets/SmallShip.png');
        this.load.image('para', './assets/Parallax.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.parallax = this.add.tileSprite(0, 0, 640, 480, 'para').setOrigin(0,0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x610C04).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.laser = new Laser(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'laser').setOrigin(0.5, 1);
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Smallship(this, game.config.width, borderUISize*7 + borderPadding*5, 'smallship', 0, 60).setOrigin(0,0);

        // define keys
        shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(borderUISize*15 + borderPadding, borderUISize + borderPadding*2, game.settings.gameTimer/1000, scoreConfig);
        scoreConfig.fixedWidth = 70
        this.fire = this.add.text(borderUISize*8 + borderPadding, borderUISize + borderPadding*2, 'FIRE', scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or A to Menu', scoreConfig).setOrigin(0.5);
            if (this.p1Score > highscore) {
                highscore = this.p1Score;
                this.add.text(game.config.width/2, game.config.height/2 + 96, 'New High Score: ' + highscore, scoreConfig).setOrigin(0.5);
            }
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyA)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 2;  // update tile sprite
        this.parallax.tilePositionX -= 4;
        for(i in Range(game.settings.gameTimer)) {
            i--
            if(Number.isInteger(i) == True) {
                this.scoreRight.text = i
            }
        }

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.laser.update();
             this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.laser, this.ship04)) {
            this.laser.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.laser, this.ship03)) {
            this.laser.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.laser, this.ship02)) {
            this.laser.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.laser, this.ship01)) {
            this.laser.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
}