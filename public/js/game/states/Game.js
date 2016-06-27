TurnUpTheVamp.Game = function() {
  this.playerMinAngle = -9;
  this.playerMaxAngle = 1;
  
  this.heartRate = 1000;
  this.heartTimer = 0;

  this.heartBigRate = 9000;
  this.heartBigTimer = 5000;

  this.powerupRate = 20000;
  this.powerupTimer = 15000;

  this.enemyRate = 800;
  this.enemyTimer = 2000;

  this.score = 0;
  this.previousHeartType = null;
  this.previousPowerUpType = null;

  this.heartSpawnX = null;
  this.heartSpacingX = 10;
  this.heartSpacingY = 10;

  this.heartBigSpawnX = null;
  this.heartBigSpacingX = 10;
  this.heartBigSpacingY = 10;

  this.powerupSpawnX = null;
  this.powerupSpacingX = 10;
  this.powerupSpacingY = 10;
};

TurnUpTheVamp.Game.prototype = {
  create: function() {

    this.game.world.bound = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);
    this.background = this.game.add.tileSprite(0, 0, this.game.width, 768, 'background');
    this.background.autoScroll(-100, 0);

    this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
    this.ground.autoScroll(-400, 0);

    this.player = this.add.sprite(200, this.game.height/2, 'player');
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.3);

    this.player.animations.add('fly', [0,1]);
    this.player.animations.play('fly', 2, true);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;

    this.game.physics.arcade.enableBody(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    this.game.physics.arcade.enableBody(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.bounce.set(0.25);

    this.hearts = this.game.add.group();
    this.heartsBig = this.game.add.group();
    this.powerups = this.game.add.group();
    this.enemies = this.game.add.group();
    this.enemiesBig = this.game.add.group();

    this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: 0', 24);

    this.heartSound = this.game.add.audio('heart');
    this.bounceSound = this.game.add.audio('bounce');
    this.deathSound = this.game.add.audio('death');
    this.gameMusic = this.game.add.audio('gameMusic');
    this.gameMusic.play('', 0, true);
    this.dubstepMusic = this.game.add.audio('dubstep');

    this.heartSpawnX = this.game.width + 64;
    this.heartBigSpawnX = this.game.width + 64;
    this.powerupSpawnX = this.game.width + 64;

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
},
  update: function() {
    if(this.spaceKey.isDown) {
      this.player.body.velocity.y -= 27.5;
    }

    if( this.player.body.velocity.y < 0 || this.spaceKey.isDown) {
      if(this.player.angle > 0) {
        this.player.angle = 0;
      }
      if(this.player.angle > this.playerMinAngle) {
        this.player.angle -= 0.5;
      }
    } else if(this.player.body.velocity.y >=0 && !this.spaceKey.isDown) {
      if(this.player.angle < this.playerMaxAngle) {
        this.player.angle += 0.5;
      }
    }

    if(this.heartTimer < this.game.time.now) {
      this.generateHearts();
      this.heartTimer = this.game.time.now + this.heartRate;
    }

    if(this.heartBigTimer < this.game.time.now) {
      this.createHeartBig();
      this.heartBigTimer = this.game.time.now + this.heartBigRate;
    }

    if(this.powerupTimer < this.game.time.now) {
      this.createPowerUp();
      this.powerupTimer = this.game.time.now + this.powerupRate;
    }

    if(this.enemyTimer < this.game.time.now) {
      this.createEnemy();
      this.enemyTimer = this.game.time.now + this.enemyRate;
    }

    this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.hearts, this.heartHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.heartsBig, this.heartBigHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.powerups, this.powerupHit, null, this);
  },
  shutdown: function() {
    this.hearts.destroy();
    this.heartsBig.destroy();
    this.powerups.destroy();
    this.enemies.destroy();
    this.enemiesBig.destroy();
    this.score = 0;
    this.heartTimer = 0;
    this.heartBigTimer = 5000;
    this.powerupTimer = 15000;
    this.enemyTimer = 2000;
  },
  createHeart: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var heart = this.hearts.getFirstExists(false);
    if(!heart) {
      heart = new Heart(this.game, 0, 0);
      this.hearts.add(heart);
    }

    heart.reset(x, y);
    heart.revive();
    return heart;
  },
  createHeartBig: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var heartBig = this.heartsBig.getFirstExists(false);
    if(!heartBig) {
      heartBig = new HeartBig(this.game, 0, 0);
      this.heartsBig.add(heartBig);
    }

    heartBig.reset(x, y);
    heartBig.revive();
    return heartBig;
  },
  createPowerUp: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var powerup = this.powerups.getFirstExists(false);
    if(!powerup) {
      powerup = new PowerUp(this.game, 0, 0);
      this.powerups.add(powerup);
    }

    powerup.reset(x, y);
    powerup.revive();
    return powerup;
  },
  generateHearts: function() {
    if(!this.previousHeartType || this.previousHeartType < 3) {
      var heartType = this.game.rnd.integer() % 5;
      switch(heartType) {
        case 0:
          //do nothing. No hearts generated
          break;
        case 1:
        case 2:
          // if the hearttype is 1 or 2, create a single heart
          //this.createHeart();
          this.createHeart();

          break;
        case 3:
          // create a small group of hearts
          this.createHeartGroup(2, 2);
          break;
        case 4:
          //create a large heart group
          this.createHeartGroup(6, 2);
          break;
        default:
          // if somehow we error on the hearttype, set the previoushearttype to zero and do nothing
          this.previousHeartType = 0;
          break;
      }

      this.previousHeartType = heartType;
    } else {
      if(this.previousHeartType === 4) {
        // the previous heart generated was a large group, 
        // skip the next generation as well
        this.previousHeartType = 3;
      } else {
        this.previousHeartType = 0;  
      }
      
    }
  },
  createHeartGroup: function(columns, rows) {
    //create 4 hearts in a group
    var heartSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var heartRowCounter = 0;
    var heartColumnCounter = 0;
    var heart;
    for(var i = 0; i < columns * rows; i++) {
      heart = this.createHeart(this.spawnX, heartSpawnY);
      heart.x = heart.x + (heartColumnCounter * heart.width) + (heartColumnCounter * this.heartSpacingX);
      heart.y = heartSpawnY + (heartRowCounter * heart.height) + (heartRowCounter * this.heartSpacingY);
      heartColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        heartRowCounter++;
        heartColumnCounter = 0;
      } 
    }
  },
  createEnemy: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var enemyBig = this.enemiesBig.getFirstExists(false);
    if(!enemyBig) {
      enemyBig = new EnemyBig(this.game, 0, 0);
      this.enemiesBig.add(enemyBig);
    }
    enemyBig.reset(x, y);
    enemyBig.revive();

    var enemy = this.enemies.getFirstExists(false);
    if(!enemy) {
      enemy = new Enemy(this.game, 0, 0);
      this.enemies.add(enemy);
    }
    enemy.reset(x, y);
    enemy.revive();

  },
  groundHit: function(player, ground) {
    player.body.velocity.y = -200;
  },
  heartHit: function(player, heart) {
    this.score++;
    this.heartSound.play();
    heart.kill();

    var dummyHeart = new Heart(this.game, heart.x, heart.y);
    this.game.add.existing(dummyHeart);

    dummyHeart.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyHeart).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyHeart.destroy();
      this.scoreText.text = 'Score: ' + this.score;
    }, this);
  },
  heartBigHit: function(player, heartBig) {
    this.score+=5;
    this.heartSound.play();
    heartBig.kill();

    var dummyHeartBig = new HeartBig(this.game, heartBig.x, heartBig.y);
    this.game.add.existing(dummyHeartBig);

    dummyHeartBig.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyHeartBig).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyHeartBig.destroy();
      this.scoreText.text = 'Score: ' + this.score;
    }, this);
  },
  powerupHit: function(player, powerup, damage) {
    if(!player.invincible) { 
      this.toggleInvincible(player);
    };

    this.bounceSound.play();
    powerup.kill();

    var dummyPowerUp = new PowerUp(this.game, powerup.x, powerup.y);
    this.game.add.existing(dummyPowerUp);

    dummyPowerUp.animations.play('spin', 40, true);
    dummyPowerUp.destroy();
  },
  toggleInvincible: function(player, enemy, enemyBig) {
    player.invincible = !player.invincible;
    if (player.invincible) {
      this.game.add.tween(player).to({tint: 0xff0000,}, 100, Phaser.Easing.Linear.NONE, true);
      this.gameMusic.pause();
      this.dubstepMusic.play('', 4.75);
      game.time.events.add(5000, this.toggleInvincible, this, player);
    }
    else {
      this.game.add.tween(player).to({tint: 0xffffff,}, 1000, Phaser.Easing.Linear.NONE, true);
      this.dubstepMusic.stop();
      this.gameMusic.resume();
    }
  },
  enemyHit: function(player, enemy, enemyBig) {
    if (!player.invincible) {

      player.kill();

      this.deathSound.play();
      this.gameMusic.stop();
      
      this.ground.stopScroll();
      this.background.stopScroll();

      this.enemies.setAll('body.velocity.x', 0);
      this.enemiesBig.setAll('body.velocity.x', 0);
      this.hearts.setAll('body.velocity.x', 0);
      this.heartsBig.setAll('body.velocity.x', 0);
      this.powerups.setAll('body.velocity.x', 0);

      this.enemyTimer = Number.MAX_VALUE;
      this.heartTimer = Number.MAX_VALUE;
      this.heartBigTimer = Number.MAX_VALUE;
      this.powerupTimer = Number.MAX_VALUE;

      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);
    }
    enemy.kill();
  }
};