ZenvaRunner.MainMenu = function() {};

ZenvaRunner.MainMenu.prototype = {
	create: function() {
		this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
		this.background.autoScroll(-100, 0);

		this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
		this.foreground.autoScroll(-100, 0);

		this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
		this.ground.autoScroll(-400, 0);
	},
	update: function() {

	}
};