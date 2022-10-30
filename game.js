import { size, playersize, coinsize, ratio, random, checkMovement } from "./functions.js";
const speed = 300;


const weapons = {
  arrows: 0,
  pistol: 30,
  rifle: 100
}

class gamescene extends Phaser.Scene {
  constructor(){
    super();
  }
  
  preload() {
    this.load.image("player", "images/player.png");
    this.load.image("demon", "images/demon.png");
    this.load.image("coin", "images/coin.png");
    this.load.image("grass", "images/grass.gif");
    this.load.image("bullet", "images/bullet.png");
    this.load.image("pistol", "images/pistol.png");
  }

  create() {
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    for(let i = size / (ratio * 2); i < size; i += size / ratio){
      for(let j = size / (ratio * 2); j < size; j += size / ratio){
        let grass = this.physics.add.image(i, j, "grass").setDepth(0);
      }
    }

    this.coins = this.physics.add.group();
    for(let i = 0; i < random(30, 50); i++){
      this.coins.create(random(coinsize / 2, size - coinsize / 2), random(coinsize / 2, size - coinsize / 2), "coin").setScale(0.75, 0.75);
    }

    this.player = this.physics.add.sprite(random(playersize / 2, size - playersize / 2), random(playersize / 2, size - playersize / 2), "player").setScale(0.75, 0.75).setDepth(1);
    this.cameras.main.startFollow(this.player);

    this.pistol = this.physics.add.sprite(this.player.x, this.player.y, "pistol").setDepth(2).setScale(0.3, 0.3);

    this.pistol.angle2 = 0;

    this.addDemons();
    this.bullets = this.physics.add.group();

    this.health = 300;
    this.healthtext = this.add.text(100, 50, "Health", { fontFamily: "Comic Sans", fontSize: 30, fill:"#000080" }).setDepth(10);
    this.healthtext.scrollFactorX = 0;
    this.healthtext.scrollFactorY = 0;

    this.healthbar = this.add.rectangle(200, 100, 200, 20, 0x0ffffff).setDepth(10);
    this.healthbar.scrollFactorX = 0;
    this.healthbar.scrollFactorY = 0;

    this.healthbarinside = this.add.rectangle(200, 100, 200, 20, 0x060f20c).setDepth(10);
    this.healthbarinside.scrollFactorX = 0;
    this.healthbarinside.scrollFactorY = 0;

    this.score = 0;

    this.scoretext = this.add.text(window.innerWidth - 200, 100, "Kills: " + this.score, { fontFamily: "Comic Sans", fontSize: 30, fill:"#000080" }).setDepth(10);
    this.scoretext.scrollFactorX = 0;
    this.scoretext.scrollFactorY = 0;

    this.ammo = 5;
    this.ammotext = this.add.text(window.innerWidth - 200, 150, "Ammo: " + this.ammo, { fontFamily: "Comic Sans", fontSize: 30, fill:"#000080" }).setDepth(10);
    this.ammotext.scrollFactorX = 0;
    this.ammotext.scrollFactorY = 0;

    this.demontext = this.add.text(window.innerWidth - 200, 200, "Zombies: 0", { fontFamily:"Comic Sans", fontSize: 30, fill:"#000080" }).setDepth(10);
    this.demontext.scrollFactorX = 0;
    this.demontext.scrollFactorY = 0;

    this.addWeaponActions();

    var gameobject = this;
    this.healFunction = setInterval(function(){
      if(gameobject.health < 100){
        gameobject.health += 1;
        gameobject.updateHealthBar();
      }
    }, 1000);

    this.physics.add.collider(this.player, this.coins, (player, coin) => {
      this.collect(player, coin);
    });

    this.physics.add.collider(this.player, this.demons, (player, demon) => {
      this.loseHealth(player, demon);
    });

    this.physics.add.collider(this.demons, this.demons, (demon1, demon2) => {
      if(random(0, 1)){
        demon1.destroy();
      } else {
        demon2.destroy();
      }
      this.demontext.setText("Zombies: " +this.demons.children.entries.length);
    });
    
    this.physics.add.collider(this.bullets, this.demons, (bullet, demon) => {
      bullet.destroy();
      demon.destroy();
      this.score += 1;
      this.scoretext.setText("Kills: " + this.score);
      this.demontext.setText("Zombies: " + this.demons.children.entries.length);
      if(this.score > localStorage.getItem("bestscore")){
        localStorage.setItem("bestscore", this.score);
      }
    });
  }

  collect(player, coin){
    this.ammo += 5;
    this.ammotext.setText("Ammo: " + this.ammo);
    coin.destroy();
    for(let i = 0; i < random(0, 2); i++){
      this.coins.create(random(coinsize / 2, size - coinsize / 2), random(coinsize / 2, size - coinsize / 2), "coin").setScale(0.75, 0.75);
    }
  }

  updateHealthBar(){
    if(this.health < 0) this.health = 0;
    this.healthbarinside.width = 200 * this.health / 100;
  }

  loseHealth(player, demon){
    demon.touchingplayer = true;
    if(demon.timeleft != 0) return;
    this.health -= 10;
    this.updateHealthBar();
    if(this.health <= 0){
      this.scene.start("diedscene");
      clearInterval(this.addDemonFunction);
    }
    demon.timeleft = 50;
  }
  


  addDemons(){
    this.demons = this.physics.add.group();
    this.addDemonFunction = setInterval(() => {
      let demon = this.demons.create(random(playersize / 2, size - playersize / 2), random(playersize / 2, size - playersize / 2), "demon").setScale(0.75, 0.75).setDepth(1);
      demon.timeleft = 0;
      demon.speed = random(100, speed);
      demon.touchingplayer = false;
      this.demontext.setText("Zombies: " + this.demons.children.entries.length)
    }, 3000);
  }

  addWeaponActions(){
    this.useweapon = true;
    window.addEventListener("mousedown", e => {
      if(!this.useweapon) return;
      if(!this.ammo) return;
      var angle = Math.atan2(e.clientY - (window.innerHeight / 2), e.clientX - (window.innerWidth / 2));
      let bullet = this.bullets.create(this.player.body.position.x + playersize / 2 + Math.cos(angle) * playersize / 4, this.player.body.position.y + playersize / 2 + Math.sin(angle) * playersize / 4, "bullet").setScale(0.5, 2);
      bullet.angle = ((angle * 180 / Math.PI) + 360) % 360;
      bullet.setVelocityX(Math.cos(angle) * 1500);
      bullet.setVelocityY(Math.sin(angle) * 1500);
      this.pistol.angle = ((angle * 180 / Math.PI) + 360) % 360;
      this.pistol.angle2 = angle;
      this.useweapon = false;
      this.ammo--;
      this.ammotext.setText("Ammo: " + this.ammo);
    });
    
    window.addEventListener("mousemove", e => {
      var angle = Math.atan2(e.clientY - (window.innerHeight / 2), e.clientX - (window.innerWidth / 2));
      this.pistol.angle = ((angle * 180 / Math.PI) + 360) % 360;
      this.pistol.angle2 = angle;
    });

    setInterval(() => {
      if(!this.useweapon){
        this.useweapon = true;
      }
    }, 500);
  }

  update() {
    let cursors = this.input.keyboard.createCursorKeys();
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    if(cursors.left.isDown || this.a.isDown){
      if(checkMovement("left", this.player.body.position.x, this.player.body.position.y)) this.player.setVelocityX(-speed);
    } if(cursors.right.isDown || this.d.isDown){
      if(checkMovement("right", this.player.body.position.x, this.player.body.position.y)) this.player.setVelocityX(speed);
    } if(cursors.up.isDown || this.w.isDown){
      if(checkMovement("up", this.player.body.position.x, this.player.body.position.y)) this.player.setVelocityY(-speed);
    } if(cursors.down.isDown || this.s.isDown){
      if(checkMovement("down", this.player.body.position.x, this.player.body.position.y))this.player.setVelocityY(speed);
    }
    this.pistol.body.position.x = this.player.body.position.x + (playersize / 4) * Math.cos(this.pistol.angle2) * 3 + 23;
    this.pistol.body.position.y = this.player.body.position.y + (playersize / 4) * Math.sin(this.pistol.angle2) * 3 + 30;

    this.player.angle = this.pistol.angle;

    for(let demon of this.demons.children.entries){
      if(demon.timeleft != 0){
        demon.timeleft -= 1;
      }
      if(demon.touchingplayer){
        demon.touchingplayer = false;
        var prevent = true;
        if(checkMovement("left", this.player.body.position.x, this.player.body.position.y) && checkMovement("right", this.player.body.position.x, this.player.body.position.y) && checkMovement("up", this.player.body.position.x, this.player.body.position.y) && checkMovement("down", this.player.body.position.x, this.player.body.position.y)){
          prevent = false;
        }
        if(prevent) return;
      }
      let angle = Math.atan2(this.player.body.position.y - demon.body.position.y, this.player.body.position.x - demon.body.position.x);
      demon.setVelocityX(Math.cos(angle) * demon.speed);
      demon.setVelocityY(Math.sin(angle) * demon.speed);
      demon.angle = ((angle * 180 / Math.PI) + 360) % 360 + 90;
      demon.touchingplayer = false;
    }
  }
}


export default gamescene;