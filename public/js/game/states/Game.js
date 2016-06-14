ZenvaRunner.Game = function() {};

ZenvaRunner.Game.prototype = {
	create: function() {
		this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
		this.background.autoScroll(-100, 0);

		this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
		this.foreground.autoScroll(-100, 0);

		this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
		this.ground.autoScroll(-400, 0);

		this.player = this.add.sprite(200, this.game.height/2, 'player');
		this.player.anchor.setTo(0.5);
		this.player.scale.setTo(0.3);

		this.player.animations.add('fly', [0,1,2,3,2,1]);
		this.player.animations.play('fly', 8, true);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 400;

		this.game.physics.arcade.enableBody(this.ground);
		this.ground.body.allowGravity = false;
		this.ground.body.immovable = true;

		this.game.physics.arcade.enableBody(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.set(.25);
	},
	update: function() {
		this.game.physics.arcade.collide(this.player, this.ground);
	},
	shutdown: function() {

	}
}