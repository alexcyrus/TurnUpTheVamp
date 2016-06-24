var Heart = function(game, x, y, key, frame) {
	key = 'hearts';
	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.scale.setTo(0.5);
	this.anchor.setTo(0.5);

	this.animations.add('shine');

	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;

	this.checkWorldBounds = true;
	this.onOutOfBoundsKill = true;

	this.events.onKilled.add(this.onKilled, this);
	this.events.onRevived.add(this.onRevived, this);
};

Heart.prototype = Object.create(Phaser.Sprite.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.onRevived = function() {
	this.body.velocity.x = -400;
	this.animations.play('shine', 10, true);
};

Heart.prototype.onKilled = function() {
	this.animations.frame = 0;
};