// MKK Space
var game;

// global object with all game options
var gameOptions = {

  // game width
  gameWidth: 840,
  // local storage name, it's the variable we will be using to save game information such as best score
  localStorageName: "MKKSpace",

  // just a string with version number to be displayed
  version: "0.1"
}

// when the window loads
window.onload = function() {

  // determining window width/height ratio
  var windowRatio = window.innerWidth / window.innerHeight;

  // we already have in mind to use 100% of window width with game canvas, so let's
  // calculate game height to cover the entire height of the window
  var gameHeight = gameOptions.gameWidth / windowRatio;



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

    game.load.image("rock", "assets/sprites/rock.png");
    game.load.image("tile", "assets/sprites/tile.png");
    game.load.spritesheet('player', 'assets/sprites/hero01.png', 16, 16);

    // preloading the bitmap font, generated with Littera bitmap font generator
    game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");

    // preloading the two audio files used in the game
    game.load.audio("taikoC", "assets/sounds/taikoC.ogg");
  },

  // once the state is ready
  create: function(){

    // handling local storage to retrieve the previously saved high score or to create a new local storage object with a zero score
    this.savedData = localStorage.getItem(gameOptions.localStorageName) == null ? {score : 0} : JSON.parse(localStorage.getItem(gameOptions.localStorageName));

    // assigning the two sounds to variables to be called later
    this.taikoCSound = game.add.audio("taikoC");
    // creation of a group where we will place all bitmap texts showing the scores
    this.scoreGroup = game.add.group();

    // adding the player
    //this.thePlayer = game.add.sprite(0, 0, "tile");
    this.thePlayer = game.add.sprite(48, 48, 'player', 1);
    this.thePlayer.smoothed = false;
    this.thePlayer.scale.set(2);//	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
    this.thePlayer.animations.add('right', [0,1,2,3], 16, true);

    // setting player registration point
    this.thePlayer.anchor.set(0.5);

    this.startScreenGroup = game.add.group();

    // we start with an overlay covering the entire game area
    var blackOverlay = game.add.sprite(0, 0, "tile");
    blackOverlay.width = game.width;
    blackOverlay.height = game.height;

    // tinting the overlay with black
    blackOverlay.tint = 0x000000;

    // setting the overlay 70% opaque
    blackOverlay.alpha = 0.7;

    // adding blackOverlay to startScreenGroup group
    this.startScreenGroup.add(blackOverlay);

    // adding a bitmap text with game title
    var titleText = game.add.bitmapText(game.width / 2, game.height / 5, "font", "Jump Jump", 48);

    // setting titleText anchor point to 0.5 (the centre)
    titleText.anchor.set(0.5);

    // adding titleText to startScreenGroup group
    this.startScreenGroup.add(titleText);

    // same thing goes with infoText
    var infoText = game.add.bitmapText(game.width / 2, game.height / 5 * 2, "font", "Space / Tap / Click to jump", 24);
    infoText.anchor.set(0.5, 0.5);
    this.startScreenGroup.add(infoText);

    // if you still haven't played the game, set score variable to zero
    if(!this.score){
      this.score = 0;
    }

    // now same concept we saw before now applies with scoresText, we are printing both the latest score and the top score
    var scoresText = game.add.bitmapText(game.width / 2, game.height / 5 * 4, "font", "Latest score\n" + this.score.toString() + "\n\nBest score\n" + this.savedData.score.toString(), 24);
    scoresText.anchor.set(0.5, 0.5);
    scoresText.align = "center";
    this.startScreenGroup.add(scoresText);

    // last but not least, let's add version text
    var versionText = game.add.bitmapText(game.width, game.height, "font", "v" + gameOptions.version, 24);
    versionText.anchor.set(1, 1);
    this.startScreenGroup.add(versionText);

    // waiting for player input, then call startRunning function
    game.input.onDown.addOnce(this.startRunning, this);

  },

  // function to be executed at each frame
  update: function(){

    this.thePlayer.x += 4;

  },



  startRunning: function(e){


    // destroying startScreenGroup and its content, removing titles, overlay, and everything not
    // strictly related to the game
    this.startScreenGroup.destroy();

    // resetting the score
    this.score = 0;


    //this.mainSound.play('sheet0');
    //this.main120bpmSound.play({ loop : true });
    this.taikoC.play();


    game.time.events.add(Phaser.Timer.SECOND * 8 ,this.stopRunning, this);


    // waiting for player input, then call startRunning function
    //	game.input.onDown.add(this.heroJump, this);

    //	var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //	key1.onDown.add(this.heroJump, this);


  },

  stopRunning: function(){

    // updating localstorage setting score as the max value between current score and saved score
    localStorage.setItem(gameOptions.localStorageName,JSON.stringify({
      score: Math.max(this.score, this.savedData.score)
    }));

    // wait ... seconds before restarting the game
    game.time.events.add(Phaser.Timer.SECOND * 1, function(){
      game.state.start("TheGame");
    }, this);




  }
}
