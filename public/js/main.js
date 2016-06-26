var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

game.state.add('Boot', TurnUpTheVamp.Boot);
game.state.add('Preloader', TurnUpTheVamp.Preload);
game.state.add('MainMenu', TurnUpTheVamp.MainMenu);
game.state.add('Game', TurnUpTheVamp.Game);

game.state.start('Boot');