ZenvaRunner.Game = function() {
  this.playerMinAngle = -2;
  this.playerMaxAngle = 2;
  
  this.coinRate = 1000;
  this.coinTimer = 0;

  this.powerupRate = 30000;
  this.powerupTimer = 0;

  this.enemyRate = 1000;
  this.enemyTimer = 0;

  this.score = 0;
  this.previousCoinType = null;
  this.previousPowerUpType = null;

  this.coinSpawnX = null;
  this.coinSpacingX = 10;
  this.coinSpacingY = 10;

  this.powerupSpawnX = null;
  this.powerupSpacingX = 10;
  this.powerupSpacingY = 10;
};

ZenvaRunner.Game.prototype = {
  create: function() {

    this.game.world.bound = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);
    this.background = this.game.add.tileSprite(0, 0, this.game.width, 768, 'background');
    this.background.autoScroll(-100, 0);

    // this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
    // this.foreground.autoScroll(-100,0);

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

    this.coins = this.game.add.group();
    this.powerups = this.game.add.group();
    this.enemies = this.game.add.group();

    this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: 0', 24);

    // this.jetSound = this.game.add.audio('rocket');
    this.coinSound = this.game.add.audio('coin');
    this.bounceSound = this.game.add.audio('bounce');
    this.deathSound = this.game.add.audio('death');
    this.gameMusic = this.game.add.audio('gameMusic');
    this.gameMusic.play('', 0, true);

    this.coinSpawnX = this.game.width + 64;
    this.powerupSpawnX = this.game.width + 64;

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
},
  update: function() {
    if(this.spaceKey.isDown) {
      this.player.body.velocity.y -= 25;
      // if(!this.jetSound.isPlaying) {
      //   this.jetSound.play('', 0, true, 0.5);
      // } 
    }
    // else {
    //   this.jetSound.stop();
    // }

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

    if(this.coinTimer < this.game.time.now) {
      this.generateCoins();
      this.coinTimer = this.game.time.now + this.coinRate;
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
    this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.powerups, this.powerupHit, null, this);

  },
  shutdown: function() {
    this.coins.destroy();
    this.powerups.destroy();
    this.enemies.destroy();
    this.score = 0;
    this.coinTimer = 0;
    this.powerupTimer = 0;
    this.enemyTimer = 0;
  },
  createCoin: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var coin = this.coins.getFirstExists(false);
    if(!coin) {
      coin = new Coin(this.game, 0, 0);
      this.coins.add(coin);
    }

    coin.reset(x, y);
    coin.revive();
    return coin;
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
  generateCoins: function() {
    if(!this.previousCoinType || this.previousCoinType < 3) {
      var coinType = this.game.rnd.integer() % 5;
      switch(coinType) {
        case 0:
          //do nothing. No coins generated
          break;
        case 1:
        case 2:
          // if the cointype is 1 or 2, create a single coin
          //this.createCoin();
          this.createCoin();

          break;
        case 3:
          // create a small group of coins
          this.createCoinGroup(2, 2);
          break;
        case 4:
          //create a large coin group
          this.createCoinGroup(6, 2);
          break;
        default:
          // if somehow we error on the cointype, set the previouscointype to zero and do nothing
          this.previousCoinType = 0;
          break;
      }

      this.previousCoinType = coinType;
    } else {
      if(this.previousCoinType === 4) {
        // the previous coin generated was a large group, 
        // skip the next generation as well
        this.previousCoinType = 3;
      } else {
        this.previousCoinType = 0;  
      }
      
    }
  },
  createCoinGroup: function(columns, rows) {
    //create 4 coins in a group
    var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var coinRowCounter = 0;
    var coinColumnCounter = 0;
    var coin;
    for(var i = 0; i < columns * rows; i++) {
      coin = this.createCoin(this.spawnX, coinSpawnY);
      coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
      coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
      coinColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        coinRowCounter++;
        coinColumnCounter = 0;
      } 
    }
  },
  createEnemy: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

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
  coinHit: function(player, coin) {
    this.score++;
    this.coinSound.play();
    coin.kill();

    var dummyCoin = new Coin(this.game, coin.x, coin.y);
    this.game.add.existing(dummyCoin);

    dummyCoin.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyCoin).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyCoin.destroy();
      this.scoreText.text = 'Score: ' + this.score;
    }, this);

  },
  powerupHit: function(player, powerup, damage) {
    if(!player.invincible) { 
      this.toggleInvincible(player);
      game.time.events.add(5000, this.toggleInvincible, this, player);
    };

    this.bounceSound.play();
    powerup.kill();

    var dummyPowerUp = new PowerUp(this.game, powerup.x, powerup.y);
    this.game.add.existing(dummyPowerUp);

    dummyPowerUp.animations.play('spin', 40, true);
    dummyPowerUp.destroy();
  },
  toggleInvincible: function(player) {
    player.invincible = !player.invincible;
    if (player.invincible) {
      player.tint = 0xff00ff;
    }
    else {
      player.tint = 16777215;
    }
  },
  enemyHit: function(player, enemy) {
    if (!player.invincible) {

      player.kill();

      this.deathSound.play();
      this.gameMusic.stop();
      
      this.ground.stopScroll();
      this.background.stopScroll();
      // this.foreground.stopScroll();

      this.enemies.setAll('body.velocity.x', 0);
      this.coins.setAll('body.velocity.x', 0);
      this.powerups.setAll('body.velocity.x', 0);

      this.enemyTimer = Number.MAX_VALUE;
      this.coinTimer = Number.MAX_VALUE;
      this.powerupTimer = Number.MAX_VALUE;

      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);
    }
    enemy.kill();
  }
};