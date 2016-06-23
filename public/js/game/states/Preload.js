ZenvaRunner.Preload = function() {
	this.ready = false;
};

ZenvaRunner.Preload.prototype = {
	preload: function() {
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);

		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);

		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('ground', 'assets/images/groundTop.png');
		this.load.image('background', 'assets/images/background-3.jpg');

		this.load.spritesheet('coins', 'assets/images/hearts.png', 82, 72, 4);
		this.load.spritesheet('player', 'assets/images/player.png', 297, 301, 2);
		this.load.spritesheet('enemy', 'assets/images/garlic.png', 157, 218, 1);
		this.load.spritesheet('enemyBig', 'assets/images/garlic.png', 157, 218, 1);
		this.load.spritesheet('powerups', 'assets/images/powerups.png', 82, 72, 1);

		this.load.audio('gameMusic', 'assets/audio/house.mp3');
		this.load.audio('bounce', 'assets/audio/bounce.wav');
		this.load.audio('coin', 'assets/audio/coin.wav');
		this.load.audio('death', 'assets/audio/death.wav');

		this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

		this.load.onLoadComplete.add(this.onLoadComplete, this);
	},
	create: function() {
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		if(this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
			this.state.start('MainMenu');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};