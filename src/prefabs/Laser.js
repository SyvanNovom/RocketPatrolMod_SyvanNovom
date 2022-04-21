//Laser prefab
class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 20;
        this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx
    }


    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyA.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed/10;
            } else if (keyD.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed/10;
            }
        }

        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyW) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

        //reset
        reset() {
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
    }
}