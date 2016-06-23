var PowerUp = function(game, x, y, key, frame) {
	key = 'powerups';
	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.scale.setTo(0.75);
	this.anchor.setTo(0.5);

	this.animations.add('spin');

	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;

	this.checkWorldBounds = true;
	this.onOutOfBoundsKill = true;

	this.events.onKilled.add(this.onKilled, this);
	this.events.onRevived.add(this.onRevived, this);
};

PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.onRevived = function() {
	this.body.velocity.x = -400;
	this.animations.play('spin', 10, true);
};

PowerUp.prototype.onKilled = function() {
	this.animations.frame = 0;
};