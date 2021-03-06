// MKK Space
var game;

// global object with all game options
var gameOptions = {
  number_of_levels : 5,
  // game width
  gameWidth: 420,
  gameHeight: 700,
  // local storage name, it's the variable we will be using to save game information such as best score
  localStorageName: "UP 0.15",

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
    game.scale.pageAlignVertically = false;

    // the game will NOT keep running even when it loses the focus
    game.stage.disableVisibilityChange = false;

    game.load.spritesheet("rock1", "assets/sprites/rock1.svg", 128, 128);
    game.load.spritesheet("rock2", "assets/sprites/rock2.svg", 128, 128);
    game.load.spritesheet("rock3", "assets/sprites/rock3.svg", 128, 128);
    game.load.spritesheet("rock4", "assets/sprites/rock4.svg", 128, 128);
    game.load.spritesheet("whitehole", "assets/sprites/whitehole.svg", 256, 256);
    game.load.spritesheet("shine", "assets/sprites/shine.svg", 128, 128);
    game.load.spritesheet("nrg", "assets/sprites/nrg.svg", 32, 32);
    game.load.image("tile", "assets/sprites/tile.png");
    //game.load.spritesheet('player', 'assets/sprites/spacekutyisprite.png', 32, 32);
    game.load.spritesheet('player', 'assets/sprites/player.svg', 128, 128);
    game.load.spritesheet('jet', 'assets/sprites/jet.svg', 128, 128);


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
    this.spring_constant = 0.25;
    //trnsformation param
    this.shrink_ratio = 0.61;
    this.oversize_scale = 0.7;
    this.nrg_bar_color = 0xCC0000;
    this.size_bar_color = 0xDDDDDD;
    this.size_bar_oversize_color = 0x333333;

    //we give them health periodically
    this.health_growing_i = 0;
    this.check_growth_i = 0;
    this.check_robbery_i = 0;

    //whitehole
    this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
    this.whitehole.anchor.set(0.5);
    this.whitehole.radius = 60;


    if (this.actual_level == 1)
    {
      this.add_rock_to_the_field(200, 100, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.5);
      this.add_rock_to_the_field(100, 200, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.4);
      this.add_rock_to_the_field(200, 200, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.3);
      this.add_rock_to_the_field(100, 300, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.2);

    }
    else if (this.actual_level == 2)
    {
      this.add_rock_to_the_field(100, 200, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.3);
      this.add_rock_to_the_field(150, 300, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.4);
      this.add_rock_to_the_field(100, 300, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.3);
      this.add_rock_to_the_field(200, 300, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.5);
    }
    else if (this.actual_level == 3)
    {
      this.add_rock_to_the_field(100, 200, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.3);
      this.add_rock_to_the_field(200, 200, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.2);
      this.add_rock_to_the_field(300, 200, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.3);
      this.add_rock_to_the_field(300, 100, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.1);


    }
    else if (this.actual_level == 4)
    {
      this.add_rock_to_the_field(100, 200, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.1);
      this.add_rock_to_the_field(100, 300, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.1);
      this.add_rock_to_the_field(100, 400, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.1);
      this.add_rock_to_the_field(300, 400, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.1);
      this.add_rock_to_the_field(100, 500, 'rock4', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(100, 600, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(100, 650, 'rock4', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);


    }
    else if (this.actual_level == 5)
    {
      this.add_rock_to_the_field( 50,  50, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.4);
      this.add_rock_to_the_field( 50, 150, 'rock2', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.3);
      this.add_rock_to_the_field( 50, 250, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,0), 0, 0, 0.4);
      this.add_rock_to_the_field(150,  50, 'rock4', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.3);
      this.add_rock_to_the_field(150, 150, 'rock4', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(150, 250, 'rock4', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(250,  50, 'rock4', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(250, 150, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(250, 250, 'rock3', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);
      this.add_rock_to_the_field(250, 350, 'rock1', [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0.1);

    }

    // adding the player
    this.thePlayer = this.add_rock_to_the_field(210, 600, 'player', [0,1,2,3], 1, [1], 2, Math.pow(this.shrink_ratio,1), 0, 0, 0);
    this.jet = game.add.sprite(this.thePlayer.x, this.thePlayer.y, 'jet', 4);
    this.jet.anchor.set(0.5);
    this.jet.scale.set(0.5);
    this.jet.animations.add('ani1', [0,1,2,3,4], 16, false);

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
    var infoText = game.add.bitmapText(game.width / 2, game.height / 5 * 2, "font", "Vortex Turmix!", 24);
    infoText.anchor.set(0.5, 0.5);
    this.startScreenGroup.add(infoText);

    level_buttons = [];
    level_texts = [];
    level_scores = [];
    for (var i = 0; i < gameOptions.number_of_levels; i++)
    {
      level_buttons[i] = game.add.button(
                              game.width / 7 * (i + 1), game.height / 5 * 2.7,
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

  add_rock_to_the_field(place_x, place_y, sprite_name, frame_array, frame_rate, shine_frame_array, shine_frame_rate, scale, v_x, v_y, rotational_speed)
  {
    rock = game.add.sprite(place_x, place_y, sprite_name, 2);

    rock.radius = 48 * scale;
    rock.mass = 8 * scale * scale * scale;
    rock.vx = v_x;
    rock.vy = v_y;
    rock.rotational_speed = rotational_speed;
    this.item_array.push(rock);

    rock.scale.set(scale);
    rock.anchor.set(0.5);
    rock.animations.add('ani1', frame_array, frame_rate, true);
    rock.play('ani1');

    rock.shine = game.add.sprite(rock.x, rock.y, 'shine');
    rock.shine.animations.add('ani1', shine_frame_array, shine_frame_rate, true);
    rock.shine.play('ani1');
    rock.shine.anchor.set(0.5);
    rock.shine.scale.set(scale);
    rock.shine.nrg = rock.shine.addChild(game.add.sprite(-32, -60, "tile"));
    rock.shine.nrg.anchor.set(0, 0.5);
    rock.shine.nrg.scale.x = 0.5;
    rock.shine.nrg.scale.y = 0.1;
    rock.shine.nrg.tint =  this.nrg_bar_color;
    rock.shine.nrg.alpha = 0.7;

    rock.shine.size = rock.shine.addChild(game.add.sprite(-32, -50, "tile"));
    rock.shine.size.anchor.set(0, 0.5);
    rock.shine.size.scale.x = rock.radius / 48;
    rock.shine.size.scale.y = 0.1;
    if (rock.scale.x > this.oversize_scale){
      rock.shine.size.tint =  this.size_bar_oversize_color;
    } else {
      rock.shine.size.tint =  this.size_bar_color;
    }
    rock.shine.size.alpha = 0.7;

    return rock;
  },

  // function to shrink an object
  shrink_item: function(item, shrink_ratio)
  {
    if (item.scale.x * shrink_ratio > 1) //split
    {
      this.add_rock_to_the_field(item.x, item.y, item.key, [0], 2, [0], 2, Math.pow(this.shrink_ratio,1), item.vx, item.vy, item.rotational_speed);
      return;
    }

    s = game.add.tween(item.scale);
    s.to({x: item.scale.x * shrink_ratio, y:item.scale.y * shrink_ratio}, 1000, Phaser.Easing.Linear.None);
    //s.onComplete.addOnce(function(){}, this);
    s.start();
    item.radius *= shrink_ratio;
    item.mass *= Math.pow(shrink_ratio, 3);
    item.shine.size.scale.x *= shrink_ratio;

    s2 = game.add.tween(item.shine.scale);
    s2.to({x: item.shine.scale.x * shrink_ratio, y:item.shine.scale.y * shrink_ratio}, 1000, Phaser.Easing.Linear.None);
    s2.start();
    if (item.shine.scale.x * shrink_ratio > this.oversize_scale){
      // color the size bar
      item.shine.size.tint = this.size_bar_oversize_color;
    } else {
      item.shine.size.tint = this.size_bar_color;
    }

  },

  // function to be executed at each frame
  update: function(){
    if(this.isTheGameRunning){
      //control the player
      acc = 0.5;
      if (!this.taikoCSound.isPlaying) //this.jet.frame == 4 &&  no good for timing
      {
        if (upKey.isDown || this.upbuttonpressed == true)
            {
              this.thePlayer.vy-=acc;
              this.score++;
              this.taikoCSound.play();
              this.jet.x = this.thePlayer.x;
              this.jet.y = this.thePlayer.y + 64;
              this.jet.angle = 90;
              this.jet.play('ani1');
            }
            else if (downKey.isDown || this.downbuttonpressed == true)
            {
              this.thePlayer.vy+=acc;
              this.score++;
              this.taikoCSound.play();
              this.jet.x = this.thePlayer.x;
              this.jet.y = this.thePlayer.y - 64;
              this.jet.angle = -90;
              this.jet.play('ani1');
            }

            if (leftKey.isDown || this.leftbuttonpressed == true)
            {
              this.thePlayer.vx-=acc;
              this.score++;
              this.taikoCSound.play();
              this.jet.x = this.thePlayer.x + 64;
              this.jet.y = this.thePlayer.y;
              this.jet.angle = 0;
              this.jet.play('ani1');
            }
            else if (rightKey.isDown || this.rightbuttonpressed == true)
            {
              this.thePlayer.vx+=acc;
              this.score++;
              this.taikoCSound.play();
              this.jet.x = this.thePlayer.x - 64;
              this.jet.y = this.thePlayer.y;
              this.jet.angle = 180;
              this.jet.play('ani1');

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
        if (item.scale.x > this.oversize_scale){
          //hole
          if ( !this.PTGSound.isPlaying && Math.abs(item.x - this.whitehole.x) < this.whitehole.radius && Math.abs(item.y - this.whitehole.y) < this.whitehole.radius) {
              this.PTGSound.play();
              this.shrink_item(item, Math.pow(this.shrink_ratio, 1 / 2))

          } else {
            isGameOver = false;
          }
        }
      }
      if (isGameOver){
          this.gameOver();
      }

      //give HP
      this.health_growing_i++;
      if (this.health_growing_i > 400)
      {
        this.health_growing_i = 0;
        for (var index = 0, len = this.item_array.length; index < len; ++index)
        {
          var item = this.item_array[index];
          item.shine.nrg.scale.x *= 1.1;
        }
      }


      //check growth
      this.check_growth_i++;
      if (this.check_growth_i > 40)
      {
        this.check_growth_i = 0;
        for (var index = 0, len = this.item_array.length; index < len; ++index)
        {
          var item = this.item_array[index];
          if (item.shine.nrg.scale.x > 1)
          {
            item.shine.nrg.scale.x = 0.2;
            this.shrink_item(item, 1 / Math.pow(this.shrink_ratio, 1 / 4))
          }
          if (item.shine.nrg.scale.x < 0.15)
          {
            item.shine.nrg.scale.x = 0.95;
            this.shrink_item(item, Math.pow(this.shrink_ratio, 1 / 4))
          }
        }
      }



      //check robbery
      this.check_robbery_i++;
      if (this.check_robbery_i > 30)
      {
        this.check_robbery_i = 0;

        for (var index = 0, len = this.item_array.length; index < len; ++index) {
          var item = this.item_array[index];
          for (var indexAffector = index + 1; indexAffector < len; ++indexAffector) {
            var itemAffector = this.item_array[indexAffector];

            this.logical_interaction(item, itemAffector);
          }
        }
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
        if (item.x + item.radius > game.width) {
          item.vx -= this.spring_constant * (item.x + item.radius - game.width);
        } else if (item.x - item.radius < 0) {
          item.vx -= this.spring_constant * (item.x - item.radius);
        }

        if (item.y + item.radius > game.height) {
          item.vy -= this.spring_constant * (item.y + item.radius - game.height);
        } else if (item.y - item.radius < 0) {
          item.vy -= this.spring_constant * (item.y - item.radius);
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

  // interactions
  //--------------------------------------------------------------------------------------------
  logical_interaction: function(object_1, object_2){

    var distance_x = object_2.x-object_1.x;
  	var distance_y = object_2.y-object_1.y;
  	var distance = Math.sqrt( Math.pow(distance_x,2) + Math.pow(distance_y,2) ) ;
  	var collision_distance = ( object_1.radius + object_2.radius ) * 1.2;


  	if( distance != 0	&& distance < collision_distance ) // touch
  	{
      //game logic: bigger object robs smaller...

      if (Math.abs(object_1.scale.x - object_2.scale.x) < (object_1.scale.x * 0.1))
      {
        //too small diff
        return;
      }

      if (object_1.scale.x > object_2.scale.x)
      {
        var bigger = object_1;
        var smaller = object_2;
      }else{
        var bigger = object_2;
        var smaller = object_1;
      }

      var loot = 0.05;

      if (smaller.shine.nrg.scale.x > 0.1)
      {
        if ( bigger.key == 'rock3'
            ||  (bigger.key == 'rock4' || bigger.key == 'player') && (smaller.key == 'rock1' || smaller.key == 'rock2'|| smaller.key == 'rock3')
            )
        {
          // no robbery
          return;
        }

        if ( (bigger.key == 'rock4' || bigger.key == 'player') && (smaller.key == 'rock4' || smaller.key == 'player') )
        {
          // help the smaller
          var swp = bigger;
          bigger = smaller;
          smaller = swp;
        }
        else if ( bigger.key == 'rock1' && smaller.key == 'rock1' )
        {
          // friendly robbery :)
          loot *= 0.25;
        }
        bigger.shine.nrg.scale.x += loot / bigger.mass * smaller.mass;
        smaller.shine.nrg.scale.x -= loot;
        var nrg = game.add.sprite(smaller.x, smaller.y, "nrg");
        nrg.anchor.set(0.5);
        nrg.scale.set(16 * loot);
        nrg.angle = Math.random() * 360;
        var tween = game.add.tween(nrg);
        tween.to({x: bigger.x, y: bigger.y}, 400, Phaser.Easing.Linear.None);
        tween.onComplete.addOnce(function(){nrg.kill()}, this);
        tween.start();

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

  //		if ( Math.max( Math.abs(object_1_ax), Math.abs(object_1_ay), Math.abs(object_2_ax), Math.abs(object_2_ay) ) < this.fast_collision_from_amax )
    if ( (collision_distance / Math.max( Math.abs(object_1.vx - object_2.vx), Math.abs(object_1.vy - object_2.vy))) > 128)
  		{
  			//"slow" collision derivative modelling
  			object_1.vx += object_1_ax;
  			object_1.vy += object_1_ay;
  			object_2.vx -= object_2_ax;
  			object_2.vy -= object_2_ay;

//  ?? sound for slow collision
//        if (!this.bassdrum04.isPlaying){
//            this.bassdrum04.play();
//        }
  		}
  		else
  		{
        angle_to_rotate_coordinate_system = Math.atan2( distance_x, distance_y );

  			//if in leaving phase then return
        angle_of_v_diff =  Math.atan2( object_1.vx - object_2.vx, object_1.vy - object_2.vy );
        //console.log(angle_to_rotate_coordinate_system +' -- '+ angle_of_v_diff);
        var angle_diff = Math.abs(angle_to_rotate_coordinate_system - angle_of_v_diff);
        //console.log(angle_diff);
        if (angle_diff > Math.PI){angle_diff = 2 * Math.PI - angle_diff;}
        //console.log(angle_diff);
  			if ( angle_diff > (Math.PI / 2)  )
        {
          //console.log('in leaving phase');
           return;
        }


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

        this.bassdrum04.play();

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
