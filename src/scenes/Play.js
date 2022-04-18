class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites 
        this.load.image('heart', './assets/heart.png');
        this.load.image('ghost', './assets/ghost.png');
        this.load.image('stars', './assets/stars.png');
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('floor','./assets/floor.png');
        this.load.image('sky', './assets/sky.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // load spritesheet
        this.load.spritesheet('bunny', './assets/bunny.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 6});
      }

    create() {
        // place tile sprite
        this.sky = this.add.tileSprite(0, 0, 640, 480, 'sky').setOrigin(0, 0);
        // place floor tile sprite
        this.floor = this.add.tileSprite(0, 0, 640, 480, 'floor').setOrigin(0, 0);
        //place tile sprite stars
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);
        // place tile sprite clouds
        this.clouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0);        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'heart').setOrigin(0.5, 0);
        
        // bunny animation config
        this.anims.create({
          key: 'bunny',
          frames: this.anims.generateFrameNumbers('bunny', { start: 0, end: 6, first: 0}),
          frameRate: 12,
          repeat: -1
        });

        // add ghosts (x3)
        this.bunny01 = new Bunny(this, game.config.width + borderUISize*6, borderUISize*4, 'bunny', 0, 30).setOrigin(0, 0);
        this.bunny02 = new Bunny(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'bunny', 0, 20).setOrigin(0,0);
        this.bunny03 = new Bunny(this, game.config.width, borderUISize*6 + borderPadding*4, 'bunny', 0, 10).setOrigin(0,0);
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
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
          fontFamily: 'Acme',
          fontSize: '28px',
          backgroundColor: '#996ED7',
          color: '#FDDFFD',
          align: 'right',
          padding: {
            top: 5,
            bottom: 5,
          },
          fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {  
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // initialize timer
        this.p1Timer = Math.ceil(this.clock.getRemainingSeconds());
        console.log(this.p1Timer);

        // display timer
        this.timerRight = this.add.text(game.config.width - borderPadding*13, borderUISize + borderPadding*2, this.p1Timer, scoreConfig);

      }
      

    update() {
        //console.log(60 - this.time.now/1000);
        this.p1Timer = Math.ceil(this.clock.getRemainingSeconds());
        this.timerRight.text = this.p1Timer;

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
          this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.scene.start("menuScene");
        }

        //this.sky.tilePositionX -= 4;        // update tile sprite
        this.clouds.tilePositionX -= 4;     // update clouds tile sprite
        this.stars.tilePositionX -= 2;      // update stars tile sprite
        this.floor.tilePositionX -= -1;      // update floor tile sprite

        if (!this.gameOver) {   
          this.p1Rocket.update();                   // update p1
          // update bunny (x3)
          this.bunny01.update();               
          this.bunny02.update();
          this.bunny03.update();
          
          // check collisions
          if(this.checkCollision(this.p1Rocket, this.bunny03)) {
            this.p1Rocket.reset();
            this.bunnyExplode(this.bunny03);
          }
          if (this.checkCollision(this.p1Rocket, this.bunny02)) {
            this.p1Rocket.reset();
            this.bunnyExplode(this.bunny02);
          }
          if (this.checkCollision(this.p1Rocket, this.bunny01)) {
            this.p1Rocket.reset();
            this.bunnyExplode(this.bunny01); 
          }
        }
      }

      checkCollision(rocket, bunny) {
        // simple AABB checking
        if (rocket.x < bunny.x + bunny.width && 
            rocket.x + rocket.width > bunny.x && 
            rocket.y < bunny.y + bunny.height &&
            rocket.height + rocket.y > bunny.y) {
                return true;
        } else {
            return false;
        }
    }

    bunnyExplode(bunny) {
      // temporarily hide bunny
      bunny.alpha = 0;
      // create explosion sprite at bunny's position
      let boom = this.add.sprite(bunny.x, bunny.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');             // play explode animation
      boom.on('animationcomplete', () => {    // callback after anim completes
        bunny.reset();                         // reset bunny position
        bunny.alpha = 1;                       // make bunny visible again
        boom.destroy();                       // remove explosion sprite
      });
      // score add and repaint
      this.p1Score += bunny.points;
      this.scoreLeft.text = this.p1Score;
      // explosion sound
      this.sound.play('sfx_explosion');          
    }
}
//pls work
//pls work x2