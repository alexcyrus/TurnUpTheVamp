var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

game.state.add('Boot', ZenvaRunner.Boot);
game.state.add('Preloader', ZenvaRunner.Preload);

game.state.start('Boot');