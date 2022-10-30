import { width, height } from "./functions.js";

class bestscores extends Phaser.Scene {
  constructor(){
    super();
  }

  preload(){
    
  }
  
  create(){
    this.add.text(window.innerWidth / 2, 100, "Your Best", { fontFamily: "Mochiy Pop One", fontSize:100 }).setOrigin(0.5);
    this.add.text(window.innerWidth / 2, 300, "Eliminations: " + localStorage.getItem("bestscore"), { fontFamily: "Mochiy Pop Oneade", fontSize:75 }).setOrigin(0.5);
    this.add.text(window.innerWidth / 2, 400, "Gold: " + localStorage.getItem("bestgold"), { fontFamily: "Mochiy Pop Onede", fontSize:75 }).setOrigin(0.5);

    this.button = this.add.rectangle(0, 0, 0, 0, 0x0f0);
    this.text = this.add.text(window.innerWidth / 2, window.innerHeight / 1.25, 'Home', { fill: '#0FFF50', fontFamily: "Mochiy Pop One", fontSize:50 }).setOrigin(0.5);
    this.button.width = this.text.width + 15;
    this.button.height = this.text.height + 15;
    this.button.x = this.text.x - (this.text.width / 2) - 5;
    this.button.y = this.text.y - (this.text.height / 2) - 5;
    this.button.setInteractive().on('pointerdown', () => {
      this.scene.start("joinscene");
    });
  }
  update(){

  }
}

export default bestscores;