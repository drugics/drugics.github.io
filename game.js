// the game itself
var game;

// global object with all game options
var gameOptions = {

     // game width
     gameWidth: 840,
}

// when the window loads
window.onload = function() {

     // determining window width/height ratio
     var windowRatio = window.innerWidth / window.innerHeight;

     // we already have in mind to use 100% of window width with game canvas, so let's
     // calculate game height to cover the entire height of the window
     var gameHeight = gameOptions.gameWidth / windowRatio;

     // now we prepare to split the screen into floorsAmount floors, and each floor will take
     // 1 / floorsAmount of game height. We use these values to populate floorY array
     for(var i = 1; i <= gameOptions.floorsAmount; i++){
          gameOptions.floorY.push(gameHeight / gameOptions.floorsAmount * i - gameOptions.floorHeight);
     }

     // game creation
	game = new Phaser.Game(gameOptions.gameWidth, gameHeight);

     // adding game state
     game.state.add("TheGame", TheGame);

     // starting game state
     game.state.start("TheGame");
}

var TheGame = function(){};

TheGame.prototype = {

     // when the state preloads
     preload: function(){

          // setting the game on maximum scale mode to cover the entire screen
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;

          // the game will keep running even when it loses the focus
          game.stage.disableVisibilityChange = true;

     // once the state is ready
     create: function(){


     // function to be executed at each frame
     update: function(){

     },
	}
}
