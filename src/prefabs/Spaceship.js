// Bunny prefab
class Bunny extends Phaser.GameObjects.Sprite {
     constructor(scene, x, y, texture, frame, pointValue) {
         super(scene, x, y, texture, frame);
         scene.add.existing(this);         // add to existing scene
         //play
         this.play('bunny');
         this.points = pointValue;         // store pointValue
         this.moveSpeed = 4;               // pixels per frame
     }

     update() {
         //scale
         this.scale = 1.2;
         //move bunny left
         this.x -= this.moveSpeed;
         //wrap around from left edge to right edge
         if(this.x <= 0 - this.width) {
             this.x = game.config.width;
         }
     }

     // position reset
     reset() {
         this.x = game.config.width;
     }
 }