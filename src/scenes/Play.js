class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites 
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('ghost', './assets/ghost.png');
        this.load.image('stars', './assets/stars.png');
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('floor','./assets/floor.png');
        this.load.image('sky', './assets/sky.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
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

        // green UI background
        //this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add ghosts (x3)
        this.ghost01 = new Ghost(this, game.config.width + borderUISize*6, borderUISize*4, 'ghost', 0, 30).setOrigin(0, 0);
        this.ghost02 = new Ghost(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'ghost', 0, 20).setOrigin(0,0);
        this.ghost03 = new Ghost(this, game.config.width, borderUISize*6 + borderPadding*4, 'ghost', 0, 10).setOrigin(0,0);
        
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
        
        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {  
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
      }
      

    update() {
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
        this.floor.tilePositionX -= 1;      // update floor tile sprite

        if (!this.gameOver) {   
          this.p1Rocket.update();                   // update p1
          // update ghost (x3)
          this.ghost01.update();               
          this.ghost02.update();
          this.ghost03.update();
          
          // check collisions
          if(this.checkCollision(this.p1Rocket, this.ghost03)) {
            this.p1Rocket.reset();
            this.ghostExplode(this.ghost03);
          }
          if (this.checkCollision(this.p1Rocket, this.ghost02)) {
            this.p1Rocket.reset();
            this.ghostExplode(this.ghost02);
          }
          if (this.checkCollision(this.p1Rocket, this.ghost01)) {
            this.p1Rocket.reset();
            this.ghostExplode(this.ghost01); 
          }
        }
      }

      checkCollision(rocket, ghost) {
        // simple AABB checking
        if (rocket.x < ghost.x + ghost.width && 
            rocket.x + rocket.width > ghost.x && 
            rocket.y < ghost.y + ghost.height &&
            rocket.height + rocket.y > ghost. y) {
                return true;
        } else {
            return false;
        }
    }

    ghostExplode(ghost) {
      // temporarily hide ghost
      ghost.alpha = 0;
      // create explosion sprite at ghost's position
      let boom = this.add.sprite(ghost.x, ghost.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');             // play explode animation
      boom.on('animationcomplete', () => {    // callback after anim completes
        ghost.reset();                         // reset ghost position
        ghost.alpha = 1;                       // make ghost visible again
        boom.destroy();                       // remove explosion sprite
      });
      // score add and repaint
      this.p1Score += ghost.points;
      this.scoreLeft.text = this.p1Score;
      // explosion sound
      this.sound.play('sfx_explosion');          
    }
}
//pls work
//pls work x2