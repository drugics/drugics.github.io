// MKK Space
var game;

// global object with all game options
var gameOptions = {
  number_of_levels : 5,
  // game width
  gameWidth: 840,
  gameHeight: 420,
  // local storage name, it's the variable we will be using to save game information such as best score
  localStorageName: "MKKSpace 0.13",

}

// when the window loads
window.onload = function() {
/*
  // determining window width/height ratio
  var windowRatio = window.innerWidth / window.innerHeight;

  // we already have in mind to use 100% of window width with game canvas, so let's
  // calculate game height to cover the entire height of the window
  var gameHeight = gameOptions.gameWidth / windowRatio;
*/


  // game creation
  game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);

  // adding game state
  game.state.add("TheGame", TheGame);

  //what does this switch do? :) slows down in FF without it
  game.forceSingleUpdate=false;
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

    // the game will NOT keep running even when it loses the focus
    game.stage.disableVisibilityChange = false;

    game.load.spritesheet("rock1", "assets/sprites/rock1.svg", 64, 64);
    game.load.spritesheet("rock2", "assets/sprites/rock2.svg", 64, 64);
    game.load.spritesheet("whitehole", "assets/sprites/whitehole.svg", 256, 256);
    game.load.spritesheet("shine", "assets/sprites/shine.svg", 64, 64);
    game.load.spritesheet("rock3", "assets/sprites/rock3.svg", 64, 64);
    game.load.image("tile", "assets/sprites/tile.png");
    //game.load.spritesheet('player', 'assets/sprites/spacekutyisprite.png', 32, 32);
    game.load.spritesheet('player', 'assets/sprites/player.svg', 64, 64);


    // preloading the bitmap font, generated with Littera bitmap font generator
    game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");

    // preloading the two audio files used in the game
    game.load.audio("taikoC", "assets/sounds/taikoC.ogg");
    game.load.audio("TMZ_PTG", "assets/sounds/TMZ_PTG.ogg");
    game.load.audio("crash02", "assets/sounds/crash02.ogg");
    game.load.audio("sidestick01", "assets/sounds/sidestick01.ogg");
    game.load.audio("bassdrum04", "assets/sounds/bassdrum04.ogg");

    //buttons
    game.load.spritesheet('buttonface', 'assets/sprites/tile.png',64,64);
    game.load.spritesheet('restartbuttonface', 'assets/sprites/restart.svg',64,64);
    game.load.spritesheet('arrowupbuttonface', 'assets/sprites/arrowup.svg',64,64);
    game.load.spritesheet('levelbuttonface', 'assets/sprites/level.svg',64,64);

    this.actual_level = 1;

  },

  // once the state is ready
  create: function(){

    this.get_saved_data();

    // assigning the two sounds to variables to be called later
    this.taikoCSound = game.add.audio("taikoC");
    this.PTGSound = game.add.audio("TMZ_PTG");
    this.crash02 = game.add.audio("crash02");
    this.sidestick01 = game.add.audio("sidestick01");
    this.bassdrum04 = game.add.audio("bassdrum04");
    //this.taikoCSound.addMarker('tokk', 0, 0.25);

    // creation of a group where we will place all bitmap texts showing the scores
    this.scoreGroup = game.add.group();

    //background
    var background = game.add.sprite(0, 0, "tile");
    background.width = game.width;
    background.height = game.height;

    // tinting the overlay
    background.tint = 0x3b8c89;

    this.isTheGameRunning = false;

    //flying objects
    this.item_array = new Array();
    //physics param
    this.spring_constant = 8;
    this.fast_collision_from_amax = 6; //??tudu

    if (this.actual_level == 1)
    {
      //whitehole
      this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
      this.whitehole.anchor.set(0.5);
      //this.whitehole.scale.set(3);
      this.whitehole.radius = 60;

      this.rock1 = game.add.sprite(200, 100, 'rock1', 2);

      this.rock1.shine = game.add.sprite(this.rock1.x, this.rock1.y, 'shine');
      this.rock1.shine.anchor.set(0.5);

      this.rock1.anchor.set(0.5);
      this.rock1.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock1.play('ani1');
      this.rock1.radius = 24;
      this.rock1.mass = 1;
      this.rock1.vx = 0;
      this.rock1.vy = 0;
      this.rock1.rotational_speed = 2;
      this.item_array.push(this.rock1);

      this.rock2 = game.add.sprite(200, 200, 'rock2', 2);

      this.rock2.shine = game.add.sprite(this.rock2.x, this.rock2.y, 'shine');
      this.rock2.shine.anchor.set(0.5);
      this.rock2.shine.scale.x *= 1.33;
      this.rock2.shine.scale.y *= 1.33;

      this.rock2.anchor.set(0.5);
      this.rock2.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock2.play('ani1');
      this.rock2.radius = 28;
      this.rock2.mass = 2;
      this.rock2.vx = 0;
      this.rock2.vy = 0;
      this.rock2.rotational_speed = 1;
      this.item_array.push(this.rock2);


      //rock3
      this.rock3 = game.add.sprite(100, 200, 'rock3', 2);
      //this.rock3.scale.set(2);
      //this.rock3.tint = 0xd70000;
      this.rock3.animations.add('ani1', [0, 1, 2, 1], 2, true);
      this.rock3.shine = game.add.sprite(this.rock3.x, this.rock3.y, 'shine');
      this.rock3.shine.anchor.set(0.5);
      this.rock3.shine.scale.x *= 1.33;
      this.rock3.shine.scale.y *= 1.33;

      this.rock3.anchor.set(0.5);
      this.rock3.play('ani1');

      this.rock3.radius = 24;
      this.rock3.mass = 2;
      this.rock3.vx = 0;
      this.rock3.vy = 0;
      this.rock3.rotational_speed = 0.5;
      this.item_array.push(this.rock3);

      // adding the player
      this.thePlayer = game.add.sprite(100, 100, 'player', 2);
      //this.thePlayer.smoothed = false;
      //this.thePlayer.scale.set(0.5);
      //	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
      //this.thePlayer.animations.add('right', [0,1,2,3], 4, true);
      this.thePlayer.animations.add('right', [0,1,2,3], 1, true);

      // setting player registration point
      this.thePlayer.anchor.set(0.5);

      this.thePlayer.radius = 24;
      this.thePlayer.mass = 1;
      this.thePlayer.vx = 0;
      this.thePlayer.vy = 0;

      this.thePlayer.play('right');
      this.item_array.push(this.thePlayer);
    }
    else if (this.actual_level == 2)
    {
      //whitehole
      this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
      this.whitehole.anchor.set(0.5);
      //this.whitehole.scale.set(3);
      this.whitehole.radius = 60;

      this.rock1 = game.add.sprite(250, 100, 'rock1', 2);

      this.rock1.shine = game.add.sprite(this.rock1.x, this.rock1.y, 'shine');
      this.rock1.shine.anchor.set(0.5);

      this.rock1.anchor.set(0.5);
      this.rock1.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock1.play('ani1');
      this.rock1.radius = 24;
      this.rock1.mass = 1;
      this.rock1.vx = 0;
      this.rock1.vy = 0;
      this.rock1.rotational_speed = 2;
      this.item_array.push(this.rock1);

      this.rock2 = game.add.sprite(200, 300, 'rock2', 2);

      this.rock2.shine = game.add.sprite(this.rock2.x, this.rock2.y, 'shine');
      this.rock2.shine.anchor.set(0.5);
      this.rock2.shine.scale.x *= 1.33;
      this.rock2.shine.scale.y *= 1.33;

      this.rock2.anchor.set(0.5);
      this.rock2.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock2.play('ani1');
      this.rock2.radius = 28;
      this.rock2.mass = 2;
      this.rock2.vx = 0;
      this.rock2.vy = 0;
      this.rock2.rotational_speed = 1;
      this.item_array.push(this.rock2);


      //rock3
      this.rock3 = game.add.sprite(100, 250, 'rock3', 2);
      //this.rock3.scale.set(2);
      //this.rock3.tint = 0xd70000;
      this.rock3.animations.add('ani1', [0, 1, 2, 1], 2, true);
      this.rock3.shine = game.add.sprite(this.rock3.x, this.rock3.y, 'shine');
      this.rock3.shine.anchor.set(0.5);
      this.rock3.shine.scale.x *= 1.33;
      this.rock3.shine.scale.y *= 1.33;

      this.rock3.anchor.set(0.5);
      this.rock3.play('ani1');

      this.rock3.radius = 24;
      this.rock3.mass = 2;
      this.rock3.vx = 0;
      this.rock3.vy = 0;
      this.rock3.rotational_speed = 0.5;
      this.item_array.push(this.rock3);

      // adding the player
      this.thePlayer = game.add.sprite(100, 100, 'player', 2);
      //this.thePlayer.smoothed = false;
      //this.thePlayer.scale.set(0.5);
      //	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
      //this.thePlayer.animations.add('right', [0,1,2,3], 4, true);
      this.thePlayer.animations.add('right', [0,1,2,3], 1, true);

      // setting player registration point
      this.thePlayer.anchor.set(0.5);

      this.thePlayer.radius = 24;
      this.thePlayer.mass = 1;
      this.thePlayer.vx = 0;
      this.thePlayer.vy = 0;

      this.thePlayer.play('right');
      this.item_array.push(this.thePlayer);
    }
    else if (this.actual_level == 3)
    {
      //whitehole
      this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
      this.whitehole.anchor.set(0.5);
      //this.whitehole.scale.set(3);
      this.whitehole.radius = 60;

      this.rock1 = game.add.sprite(200, 100, 'rock1', 2);

      this.rock1.shine = game.add.sprite(this.rock1.x, this.rock1.y, 'shine');
      this.rock1.shine.anchor.set(0.5);

      this.rock1.anchor.set(0.5);
      this.rock1.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock1.play('ani1');
      this.rock1.radius = 24;
      this.rock1.mass = 1;
      this.rock1.vx = 0;
      this.rock1.vy = 0;
      this.rock1.rotational_speed = 2;
      this.item_array.push(this.rock1);

      this.rock2 = game.add.sprite(200, 200, 'rock2', 2);

      this.rock2.shine = game.add.sprite(this.rock2.x, this.rock2.y, 'shine');
      this.rock2.shine.anchor.set(0.5);
      this.rock2.shine.scale.x *= 1.33;
      this.rock2.shine.scale.y *= 1.33;

      this.rock2.anchor.set(0.5);
      this.rock2.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock2.play('ani1');
      this.rock2.radius = 28;
      this.rock2.mass = 2;
      this.rock2.vx = 0;
      this.rock2.vy = 0;
      this.rock2.rotational_speed = 1;
      this.item_array.push(this.rock2);


      //rock3
      this.rock3 = game.add.sprite(200, 300, 'rock3', 2);
      //this.rock3.scale.set(2);
      //this.rock3.tint = 0xd70000;
      this.rock3.animations.add('ani1', [0, 1, 2, 1], 2, true);
      this.rock3.shine = game.add.sprite(this.rock3.x, this.rock3.y, 'shine');
      this.rock3.shine.anchor.set(0.5);
      this.rock3.shine.scale.x *= 1.33;
      this.rock3.shine.scale.y *= 1.33;

      this.rock3.anchor.set(0.5);
      this.rock3.play('ani1');

      this.rock3.radius = 24;
      this.rock3.mass = 2;
      this.rock3.vx = 0;
      this.rock3.vy = 0;
      this.rock3.rotational_speed = 0.5;
      this.item_array.push(this.rock3);

      // adding the player
      this.thePlayer = game.add.sprite(100, 100, 'player', 2);
      //this.thePlayer.smoothed = false;
      //this.thePlayer.scale.set(0.5);
      //	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
      //this.thePlayer.animations.add('right', [0,1,2,3], 4, true);
      this.thePlayer.animations.add('right', [0,1,2,3], 1, true);

      // setting player registration point
      this.thePlayer.anchor.set(0.5);

      this.thePlayer.radius = 24;
      this.thePlayer.mass = 1;
      this.thePlayer.vx = 0;
      this.thePlayer.vy = 0;

      this.thePlayer.play('right');
      this.item_array.push(this.thePlayer);
    }
    else if (this.actual_level == 4)
    {
      //whitehole
      this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
      this.whitehole.anchor.set(0.5);
      //this.whitehole.scale.set(3);
      this.whitehole.radius = 60;

      this.rock1 = game.add.sprite(200, 100, 'rock1', 2);

      this.rock1.shine = game.add.sprite(this.rock1.x, this.rock1.y, 'shine');
      this.rock1.shine.anchor.set(0.5);

      this.rock1.anchor.set(0.5);
      this.rock1.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock1.play('ani1');
      this.rock1.radius = 24;
      this.rock1.mass = 1;
      this.rock1.vx = 0;
      this.rock1.vy = 0;
      this.rock1.rotational_speed = 2;
      this.item_array.push(this.rock1);

      this.rock2 = game.add.sprite(300, 100, 'rock2', 2);

      this.rock2.shine = game.add.sprite(this.rock2.x, this.rock2.y, 'shine');
      this.rock2.shine.anchor.set(0.5);
      this.rock2.shine.scale.x *= 1.33;
      this.rock2.shine.scale.y *= 1.33;

      this.rock2.anchor.set(0.5);
      this.rock2.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock2.play('ani1');
      this.rock2.radius = 28;
      this.rock2.mass = 2;
      this.rock2.vx = 0;
      this.rock2.vy = 0;
      this.rock2.rotational_speed = 1;
      this.item_array.push(this.rock2);


      //rock3
      this.rock3 = game.add.sprite(400, 100, 'rock3', 2);
      //this.rock3.scale.set(2);
      //this.rock3.tint = 0xd70000;
      this.rock3.animations.add('ani1', [0, 1, 2, 1], 2, true);
      this.rock3.shine = game.add.sprite(this.rock3.x, this.rock3.y, 'shine');
      this.rock3.shine.anchor.set(0.5);
      this.rock3.shine.scale.x *= 1.33;
      this.rock3.shine.scale.y *= 1.33;

      this.rock3.anchor.set(0.5);
      this.rock3.play('ani1');

      this.rock3.radius = 24;
      this.rock3.mass = 2;
      this.rock3.vx = 0;
      this.rock3.vy = 0;
      this.rock3.rotational_speed = 0.5;
      this.item_array.push(this.rock3);

      // adding the player
      this.thePlayer = game.add.sprite(100, 100, 'player', 2);
      //this.thePlayer.smoothed = false;
      //this.thePlayer.scale.set(0.5);
      //	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
      //this.thePlayer.animations.add('right', [0,1,2,3], 4, true);
      this.thePlayer.animations.add('right', [0,1,2,3], 1, true);

      // setting player registration point
      this.thePlayer.anchor.set(0.5);

      this.thePlayer.radius = 24;
      this.thePlayer.mass = 1;
      this.thePlayer.vx = 0;
      this.thePlayer.vy = 0;

      this.thePlayer.play('right');
      this.item_array.push(this.thePlayer);
    }
    else if (this.actual_level == 5)
    {
      //whitehole
      this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
      this.whitehole.anchor.set(0.5);
      //this.whitehole.scale.set(3);
      this.whitehole.radius = 60;

      this.rock1 = game.add.sprite(300, 100, 'rock1', 2);

      this.rock1.shine = game.add.sprite(this.rock1.x, this.rock1.y, 'shine');
      this.rock1.shine.anchor.set(0.5);

      this.rock1.anchor.set(0.5);
      this.rock1.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock1.play('ani1');
      this.rock1.radius = 24;
      this.rock1.mass = 1;
      this.rock1.vx = 0;
      this.rock1.vy = 0;
      this.rock1.rotational_speed = 2;
      this.item_array.push(this.rock1);

      this.rock2 = game.add.sprite(350, 100, 'rock2', 2);

      this.rock2.shine = game.add.sprite(this.rock2.x, this.rock2.y, 'shine');
      this.rock2.shine.anchor.set(0.5);
      this.rock2.shine.scale.x *= 1.33;
      this.rock2.shine.scale.y *= 1.33;

      this.rock2.anchor.set(0.5);
      this.rock2.animations.add('ani1', [0, 1, 2, 1], 1, true);
      this.rock2.play('ani1');
      this.rock2.radius = 28;
      this.rock2.mass = 2;
      this.rock2.vx = 0;
      this.rock2.vy = 0;
      this.rock2.rotational_speed = 1;
      this.item_array.push(this.rock2);


      //rock3
      this.rock3 = game.add.sprite(400, 100, 'rock3', 2);
      //this.rock3.scale.set(2);
      //this.rock3.tint = 0xd70000;
      this.rock3.animations.add('ani1', [0, 1, 2, 1], 2, true);
      this.rock3.shine = game.add.sprite(this.rock3.x, this.rock3.y, 'shine');
      this.rock3.shine.anchor.set(0.5);
      this.rock3.shine.scale.x *= 1.33;
      this.rock3.shine.scale.y *= 1.33;

      this.rock3.anchor.set(0.5);
      this.rock3.play('ani1');

      this.rock3.radius = 24;
      this.rock3.mass = 2;
      this.rock3.vx = 0;
      this.rock3.vy = 0;
      this.rock3.rotational_speed = 0.5;
      this.item_array.push(this.rock3);

      // adding the player
      this.thePlayer = game.add.sprite(100, 100, 'player', 2);
      //this.thePlayer.smoothed = false;
      //this.thePlayer.scale.set(0.5);
      //	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
      //this.thePlayer.animations.add('right', [0,1,2,3], 4, true);
      this.thePlayer.animations.add('right', [0,1,2,3], 1, true);

      // setting player registration point
      this.thePlayer.anchor.set(0.5);

      this.thePlayer.radius = 24;
      this.thePlayer.mass = 1;
      this.thePlayer.vx = 0;
      this.thePlayer.vy = 0;

      this.thePlayer.play('right');
      this.item_array.push(this.thePlayer);
    }


    this.actualScoreText = game.add.bitmapText(0, 0, "font", '', 36);
    this.actualScoreText.anchor.set(0, 0);



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
    var titleText = game.add.bitmapText(game.width / 2, game.height / 5, "font", gameOptions.localStorageName, 48);

    // setting titleText anchor point to 0.5 (the centre)
    titleText.anchor.set(0.5);

    // adding titleText to startScreenGroup group
    this.startScreenGroup.add(titleText);

    // same thing goes with infoText
    var infoText = game.add.bitmapText(game.width / 2, game.height / 5 * 2, "font", "Select level", 24);
    infoText.anchor.set(0.5, 0.5);
    this.startScreenGroup.add(infoText);

    level_buttons = [];
    level_texts = [];
    level_scores = [];
    for (var i = 0; i < gameOptions.number_of_levels; i++)
    {
      level_buttons[i] = game.add.button(
                              game.width / 10 * (i + 3), game.height / 5 * 2.7,
                              'levelbuttonface',
                              null,
                              this,
      0, 1, 2, 3);



      if (i==0 || this.savedData.scores[i-1] != 999999)
      {
        //I can pass in i and read out from arguments[2]
        level_buttons[i].events.onInputDown.add(function() { this.actual_level = arguments[2] + 1; this.create();this.gameOn(); console.log(arguments[2]); }, this, 0, i);
      }
      else
      {
        level_buttons[i].tint = 0x666666;
      }

      level_buttons[i].anchor.set(0.5, 0.5);
      this.startScreenGroup.add(level_buttons[i]);
      level_texts[i] = level_buttons[i].addChild(game.add.bitmapText(0, 0, "font", (i+1)+'\n\n', 16));
      level_texts[i].anchor.set(0.5, 0.5);
      level_texts[i].tint = 0x222222;
      level_texts[i].align = "center";
      var scoreString = '-';
      if (this.savedData.scores[i] != 999999)
      {
        scoreString = this.savedData.scores[i].toString();
      }
      level_scores[i] = level_buttons[i].addChild(game.add.bitmapText(0, 0, "font", '\n\n' + scoreString, 16));
      level_scores[i].anchor.set(0.5, 0.5);
      level_scores[i].tint = 0x224422;
      if (this.savedData.scores[i] <= 50)
      {
        level_scores[i].tint = 0xaeae13;
      }
      level_scores[i].align = "center";
    }

    // waiting for player input, then call gameOn function
    //game.input.onDown.addOnce(this.gameOn, this);
    //var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //key1.onDown.addOnce(this.gameOn, this);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

  },


  // function to be executed at each frame
  update: function(){
    if(this.isTheGameRunning){
      //control the player
      acc = 0.5;
      if (!this.taikoCSound.isPlaying)
      {
        if (upKey.isDown || this.upbuttonpressed == true)
            {
              this.thePlayer.vy-=acc;
              this.score++;
              this.taikoCSound.play();
            }
            else if (downKey.isDown || this.downbuttonpressed == true)
            {
              this.thePlayer.vy+=acc;
              this.score++;
              this.taikoCSound.play();
            }

            if (leftKey.isDown || this.leftbuttonpressed == true)
            {
              this.thePlayer.vx-=acc;
              this.score++;
              this.taikoCSound.play();
            }
            else if (rightKey.isDown || this.rightbuttonpressed == true)
            {
              this.thePlayer.vx+=acc;
              this.score++;
              this.taikoCSound.play();
            }
          }

      //rotate the whitehole
      this.whitehole.angle -= 0.5;

      this.actualScoreText.text = this.score

      this.physical_interactions();

      //is it over?
      var isGameOver = true;
      for (var index = 0, len = this.item_array.length; index < len; ++index) {
        var item = this.item_array[index];
        if (!item.isShrunk){
          //hole
          if ( Math.abs(item.x - this.whitehole.x) < this.whitehole.radius && Math.abs(item.y - this.whitehole.y) < this.whitehole.radius) {
              item.isShrunk = true;
              this.PTGSound.play();
              s = game.add.tween(item.scale);
              s.to({x: 0.5, y:0.5}, 2000, Phaser.Easing.Linear.None);
              //s.onComplete.addOnce(function(){}, this);
              s.start();
              item.radius *= 0.5;
              item.mass *= 0.125;
              if (item.shine != null){
                s2 = game.add.tween(item.shine.scale);
                s2.to({x: 0.5, y:0.5}, 2000, Phaser.Easing.Linear.None);
                s2.start();
              }

          } else {
            isGameOver = false;
          }
        }
      }
      if (isGameOver){
          this.gameOver();
      }
    }
  },




  gameOn: function(e){

    this.isTheGameRunning = true;
    // destroying startScreenGroup and its content, removing titles, overlay, and everything not
    // strictly related to the game
    this.startScreenGroup.destroy();

    // resetting the score
    this.score = 0;



    //this.mainSound.play('sheet0');
    //this.main120bpmSound.play({ loop : true });
    this.thePlayer.play('right');
    this.thePlayer.vx = 0;
    this.thePlayer.vy = 0;

    buttonRestart = game.add.button(game.width, 0, 'restartbuttonface', null, this, 0, 1, 2, 3);
    buttonRestart.anchor.set(1, 0);
    buttonRestart.scale.set(0.5);
    buttonRestart.alpha = 0.5;

    buttonRestart.fixedToCamera = true;
  //  buttonRestart.events.onInputOver.add(this.restart, this);
  //  buttonRestart.events.onInputOut.add(function(){downbuttonpressed=false;});
    buttonRestart.events.onInputDown.add(this.restart, this);
  //  buttonRestart.events.onInputUp.add(function(){downbuttonpressed=false;});

    if (!game.device.desktop){
      //arrowButtons
      arrowButtonsPlaceX = game.width - 120;
      arrowButtonsPlaceY = game.height - 120;
      arrowButtonsPlaceOffset = 64;
      buttonDown = game.add.button(arrowButtonsPlaceX, arrowButtonsPlaceY + arrowButtonsPlaceOffset, 'arrowupbuttonface', null, this, 0, 1, 0, 1);
      buttonDown.angle = 180;
      buttonDown.anchor.set(0.5);
      buttonDown.alpha = 0.5;
      buttonDown.fixedToCamera = true;
      buttonDown.events.onInputOver.add(function(){this.downbuttonpressed=true;},this);
      buttonDown.events.onInputOut.add(function(){this.downbuttonpressed=false;},this);
      buttonDown.events.onInputDown.add(function(){this.downbuttonpressed=true;},this);
      buttonDown.events.onInputUp.add(function(){this.downbuttonpressed=false;},this);

      buttonUp = game.add.button(arrowButtonsPlaceX, arrowButtonsPlaceY - arrowButtonsPlaceOffset, 'arrowupbuttonface', null, this, 0, 1, 0, 1);
      buttonUp.angle = 0;
      buttonUp.anchor.set(0.5);
      buttonUp.alpha = 0.5;
      buttonUp.fixedToCamera = true;
      buttonUp.events.onInputOver.add(function(){this.upbuttonpressed=true;},this);
      buttonUp.events.onInputOut.add(function(){this.upbuttonpressed=false;},this);
      buttonUp.events.onInputDown.add(function(){this.upbuttonpressed=true;},this);
      buttonUp.events.onInputUp.add(function(){this.upbuttonpressed=false;},this);

      buttonLeft = game.add.button(arrowButtonsPlaceX - arrowButtonsPlaceOffset, arrowButtonsPlaceY, 'arrowupbuttonface', null, this, 0, 1, 0, 1);
      buttonLeft.angle = 270;
      buttonLeft.anchor.set(0.5);
      buttonLeft.alpha = 0.5;
      buttonLeft.fixedToCamera = true;
      buttonLeft.events.onInputOver.add(function(){this.leftbuttonpressed=true;},this);
      buttonLeft.events.onInputOut.add(function(){this.leftbuttonpressed=false;},this);
      buttonLeft.events.onInputDown.add(function(){this.leftbuttonpressed=true;},this);
      buttonLeft.events.onInputUp.add(function(){this.leftbuttonpressed=false;},this);

      buttonRight = game.add.button(arrowButtonsPlaceX + arrowButtonsPlaceOffset, arrowButtonsPlaceY, 'arrowupbuttonface', null, this, 0, 1, 0, 1);
      buttonRight.angle = 90;
      buttonRight.anchor.set(0.5);
      buttonRight.alpha = 0.5;
      buttonRight.fixedToCamera = true;
      buttonRight.events.onInputOver.add(function(){this.rightbuttonpressed=true;},this);
      buttonRight.events.onInputOut.add(function(){this.rightbuttonpressed=false;},this);
      buttonRight.events.onInputDown.add(function(){this.rightbuttonpressed=true;},this);
      buttonRight.events.onInputUp.add(function(){this.rightbuttonpressed=false;},this);
    }


  },

  load_and_start_level: function(level){
    this.actual_level = level;
    this.create();
    this.gameOn();
  },

  restart: function(){
    this.score = 999999;
    this.gameOver();
  },

  gameOver: function(){
    // updating localstorage setting score as the min value between current score and saved score
    this.savedData.scores[this.actual_level - 1] = Math.min(this.score, this.savedData.scores[this.actual_level - 1]);

    /*
    if (this.actual_level == 1)
    {
      this.savedData.scores[0] = Math.min(this.score, this.savedData.scores[0]);
    }
    else if (this.actual_level == 2)
    {
      this.savedData.scores[1] = Math.min(this.score, this.savedData.scores[1]);
    }
*/
    this.set_saved_data();

    this.isTheGameRunning = false;
    var finalScoreText = game.add.bitmapText(gameOptions.gameWidth/2, gameOptions.gameHeight/2, "font", this.score, 36);
    finalScoreText.anchor.set(0.5, 0.5);
    finalScoreText.tint = 0xe6ff12;
    var scale_tween = game.add.tween(finalScoreText.scale);
    scale_tween.to({x: 10, y: 10}, 4000, Phaser.Easing.Linear.None);
    //s.onComplete.addOnce(function(){}, this);
    scale_tween.start();
    this.score = 0;
    // wait ... seconds before restarting the game
    game.time.events.add(Phaser.Timer.SECOND * 5, function(){
      game.state.start("TheGame");
    }, this);




  },


  get_saved_data: function(){

    if (localStorage.getItem(gameOptions.localStorageName) != null)
    {
      console.log(localStorage.getItem(gameOptions.localStorageName));
      this.savedData = JSON.parse(localStorage.getItem(gameOptions.localStorageName));
    }
    else
    {
      var scorestmp = [];
      for (var i = 1; i <= gameOptions.number_of_levels; i++)
      {
        scorestmp.push(999999);
      }
      this.savedData = { scores : scorestmp };
    }

  },

  set_saved_data: function(){
    console.log('set'+JSON.stringify(this.savedData));
    localStorage.setItem(gameOptions.localStorageName, JSON.stringify(this.savedData));
  },


  physical_interactions: function(){

      for (var index = 0, len = this.item_array.length; index < len; ++index) {
        var item = this.item_array[index];
        for (var indexAffector = index + 1; indexAffector < len; ++indexAffector) {
          var itemAffector = this.item_array[indexAffector];

          this.calculate_new_velocity(item, itemAffector);
        }
      }


      for (var index = 0, len = this.item_array.length; index < len; ++index) {
        var item = this.item_array[index];

        //..gravity, friction...

        // wall
        if (item.x > game.width) {
          item.vx = -Math.abs(item.vx)*0.8;
        } else if (item.x < 0) {
          item.vx = Math.abs(item.vx)*0.8;
        }

        if (item.y > game.height) {
          item.vy = -Math.abs(item.vy)*0.8;
        } else if (item.y < 0) {
          item.vy = Math.abs(item.vy)*0.8;
        }

        //friction
        item.vx *= 0.999;
        item.vy *= 0.999;

        //calculate new position
        item.x += item.vx;
        item.y += item.vy;

        //rotation
        if (item.rotational_speed != null){item.angle += item.rotational_speed;}

        //shine layer
        if (item.shine != null){
          item.shine.x = item.x;
          item.shine.y = item.y;
        }



      }

    },

  // collisions
  //--------------------------------------------------------------------------------------------
  calculate_new_velocity: function(object_1, object_2){

  	var distance_x = object_2.x-object_1.x;
  	var distance_y = object_2.y-object_1.y;
  	var distance = Math.sqrt( Math.pow(distance_x,2) + Math.pow(distance_y,2) ) ;
  	var collision_distance = ( object_1.radius + object_2.radius );

  	if( distance != 0	&& distance < collision_distance ) // touch
  	{

  		var fAbsPerDistance = ( 1 - distance/collision_distance ) * -this.spring_constant / distance;
  		force1_fx =  fAbsPerDistance * distance_x;
  		force1_fy =  fAbsPerDistance * distance_y;

  		var object_1_ax = force1_fx /object_1.mass ;
  		var object_1_ay = force1_fy /object_1.mass ;
  		var object_2_ax = force1_fx /object_2.mass ;
  		var object_2_ay = force1_fy /object_2.mass ;

  		if ( Math.max( Math.abs(object_1_ax), Math.abs(object_1_ay), Math.abs(object_2_ax), Math.abs(object_2_ay) ) < this.fast_collision_from_amax
  			)
  		{
  			//"slow" collision derivative modelling
  			object_1.vx += object_1_ax;
  			object_1.vy += object_1_ay;
  			object_2.vx -= object_2_ax;
  			object_2.vy -= object_2_ay;
        if (!this.bassdrum04.isPlaying){this.bassdrum04.play();}
  		}
  		else
  		{
  			//leaving phase
  			var t2_distance_x = (object_2.sx + object_2.vx) - (object_1.sx + object_1.vx);
  			var t2_distance_y = (object_2.sy + object_2.vy) - (object_1.sy + object_1.vy);
  			var t2_distance = Math.sqrt( Math.pow(t2_distance_x,2) + Math.pow(t2_distance_y,2) ) ;
  			if (t2_distance > distance) return;

  			angle_to_rotate_coordinate_system = Math.atan(
  																distance_x
  																/
  																distance_y
  															);

  			var tmp_cartesian_v_object_1 =  {x: object_1.vx, y: object_1.vy};
  			var tmp_cartesian_v_object_2 =  {x: object_2.vx, y: object_2.vy};

  			var tmp_polar_v_object_1 =  this.cartesian_to_polar_coordinates(tmp_cartesian_v_object_1);
  			var tmp_polar_v_object_2 =  this.cartesian_to_polar_coordinates(tmp_cartesian_v_object_2);

  			tmp_polar_v_object_1.angle -= angle_to_rotate_coordinate_system;
  			tmp_polar_v_object_2.angle -= angle_to_rotate_coordinate_system;

  			tmp_cartesian_v_object_1 = this.polar_to_cartesian_coordinates(tmp_polar_v_object_1);
  			tmp_cartesian_v_object_2 = this.polar_to_cartesian_coordinates(tmp_polar_v_object_2);

  			//elastic collison 1D

  			var tmp_cartesian_v_object_1_y
  			 =
  			(
  				(
  					tmp_cartesian_v_object_1.y
  					*
  					(object_1.mass - object_2.mass)
  				)
  				+
  				(
  					tmp_cartesian_v_object_2.y
  					*
  					2 * object_2.mass
  				)
  			)
  			/
  			(object_1.mass + object_2.mass) ;


  			tmp_cartesian_v_object_2.y
  			 =
  			(
  				(
  					tmp_cartesian_v_object_2.y
  					*
  					(object_2.mass - object_1.mass)
  				)
  				+
  				(
  					tmp_cartesian_v_object_1.y
  					*
  					2 * object_1.mass
  				)
  			)
  			/
  			(object_1.mass + object_2.mass) ;


  			tmp_cartesian_v_object_1.y	 = tmp_cartesian_v_object_1_y;

  			//rotate system back
  			tmp_polar_v_object_1 =  this.cartesian_to_polar_coordinates(tmp_cartesian_v_object_1);
  			tmp_polar_v_object_2 =  this.cartesian_to_polar_coordinates(tmp_cartesian_v_object_2);

  			tmp_polar_v_object_1.angle += angle_to_rotate_coordinate_system;
  			tmp_polar_v_object_2.angle += angle_to_rotate_coordinate_system;

  			tmp_cartesian_v_object_1 = this.polar_to_cartesian_coordinates(tmp_polar_v_object_1);
  			tmp_cartesian_v_object_2 = this.polar_to_cartesian_coordinates(tmp_polar_v_object_2);


  			object_1.vx = tmp_cartesian_v_object_1.x;
  			object_1.vy = tmp_cartesian_v_object_1.y;
        object_2.vx = tmp_cartesian_v_object_2.x;

  			object_2.vy = tmp_cartesian_v_object_2.y;

        this.sidestick01.play();

  		}

  	}

  },

  //-----------------------------------------------
  cartesian_to_polar_coordinates: function(cartesian_coordinates){
  	var polar_coordinates = {len:0, angle:0};
  	polar_coordinates.len = Math.sqrt(
  										Math.pow(cartesian_coordinates.y ,2)
  										+
  										Math.pow(cartesian_coordinates.x ,2)
  									);

  	if (cartesian_coordinates.x == 0 && cartesian_coordinates.y == 0)
  	{
  		polar_coordinates.angle = 0;
  	}
  	else if (cartesian_coordinates.y >= 0)
  	{
  		polar_coordinates.angle = Math.asin( cartesian_coordinates.x / polar_coordinates.len);
  	}
  	else if(cartesian_coordinates.y < 0)
  	{
  		polar_coordinates.angle = Math.PI - Math.asin( cartesian_coordinates.x / polar_coordinates.len);
  	}


  	return polar_coordinates;

  },

  //-----------------------------------------------
  polar_to_cartesian_coordinates: function(polar_coordinates){

  	var cartesian_coordinates  = {x:0, y:0};
  	cartesian_coordinates.x = Math.sin(polar_coordinates.angle) * polar_coordinates.len;
  	cartesian_coordinates.y = Math.cos(polar_coordinates.angle) * polar_coordinates.len;
  	return cartesian_coordinates;

  }


}
