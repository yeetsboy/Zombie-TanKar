import { width, height } from "./functions.js";

class howtoplay extends Phaser.Scene {
  constructor(){
    super();
  }

  preload(){
    
  }
  
  create(){
    this.add.text(window.innerWidth / 2, 100, "How To Play Zombie TanKar", { fontFamily: "Mochiy Pop One", fontSize:75, fill:"#C21807" }).setOrigin(0.5);
    this.add.text(window.innerWidth / 2, 250, "WASD and Arrow keys to move the person, click to shoot\n\nTry to eliminate as many zombies as you can!\n\nGood Luck!", { fontFamily: "Mochiy Pop One", fontSize:30 }).setOrigin(0.5);
    this.button = this.add.rectangle(0, 0, 0, 0, 0x0f0);
    this.text = this.add.text(window.innerWidth / 2, window.innerHeight / 1.5, 'Home', { fill: '#C21807', fontFamily: "Mochiy Pop One", fontSize:50 }).setOrigin(0.5);
    this.button.width = this.text.width + 10;
    this.button.height = this.text.height + 10;
    this.button.x = this.text.x - (this.text.width / 2) - 5;
    this.button.y = this.text.y - (this.text.height / 2) - 5;
    this.button.setInteractive().on("pointerdown", () => {
      this.scene.start("joinscene");
    });
  }
  
  update(){

  }
}

export default howtoplay;