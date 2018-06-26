// MKK Space
var game;

// global object with all game options
var gameOptions = {

  // game width
  gameWidth: 840,
  gameHeight: 420,
  // local storage name, it's the variable we will be using to save game information such as best score
  localStorageName: "MKKSpace v0.1",

  // just a string with version number to be displayed
  version: "0.1"
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
    game.load.spritesheet("whitehole", "assets/sprites/whitehole.svg", 64, 64);
    game.load.spritesheet("shine", "assets/sprites/shine.svg", 64, 64);
    game.load.spritesheet("rock3", "assets/sprites/rock3.svg", 64, 64);
    game.load.image("tile", "assets/sprites/tile.png");
    //game.load.spritesheet('player', 'assets/sprites/spacekutyisprite.png', 32, 32);
    game.load.spritesheet('player', 'assets/sprites/player.svg', 64, 64);


    // preloading the bitmap font, generated with Littera bitmap font generator
    game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");

    // preloading the two audio files used in the game
    game.load.audio("taikoC", "assets/sounds/taikoC.ogg");

    //buttons
    game.load.spritesheet('buttonface', 'assets/sprites/tile.png',64,64);
    game.load.spritesheet('restartbuttonface', 'assets/sprites/restart.svg',64,64);
    game.load.spritesheet('arrowupbuttonface', 'assets/sprites/arrowup.svg',64,64);

  },

  // once the state is ready
  create: function(){

    // handling local storage to retrieve the previously saved high score or to create a new local storage object with a zero score
    this.savedData = localStorage.getItem(gameOptions.localStorageName) == null ? {score : 999999} : JSON.parse(localStorage.getItem(gameOptions.localStorageName));

    // assigning the two sounds to variables to be called later
    this.taikoCSound = game.add.audio("taikoC");
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
    this.fast_collision_from_amax = 10; //??

    //whitehole
    this.whitehole = game.add.image(gameOptions.gameWidth/2, game.height/2, 'whitehole');
    this.whitehole.anchor.set(0.5);
    //this.whitehole.scale.set(1.5);

    this.rock1 = game.add.sprite(200, 200, 'rock1', 2);

    this.rock1.shine = game.add.sprite(0, 0, 'shine');
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

    this.rock2 = game.add.sprite(300, 200, 'rock2', 2);

    this.rock2.shine = game.add.sprite(0, 0, 'shine');
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
    this.rock3 = game.add.sprite(48, 248, 'rock3', 2);
    //this.rock3.scale.set(2);
    //this.rock3.tint = 0xd70000;
    this.rock3.animations.add('right', [0, 1, 2, 1], 2, true);
    this.rock3.shine = game.add.sprite(0, 0, 'shine');
    this.rock3.shine.anchor.set(0.5);
    this.rock3.shine.scale.x *= 1.33;
    this.rock3.shine.scale.y *= 1.33;

    this.rock3.anchor.set(0.5);
    this.rock3.play('left');

    this.rock3.radius = 24;
    this.rock3.mass = 2;
    this.rock3.vx = 0;
    this.rock3.vy = 0;
    this.rock3.rotational_speed = 0.5;
    this.item_array.push(this.rock3);

    // adding the player
    this.thePlayer = game.add.sprite(148, 148, 'player', 2);
    //this.thePlayer.smoothed = false;
    //this.thePlayer.scale.set(0.5);
    //	this.thePlayer.animations.add('right', [1,2,3,4], 16, true);
    //this.thePlayer.animations.add('right', [0,1,2,3], 4, true);
    this.thePlayer.animations.add('right', [0,0,0,0], 4, true);

    // setting player registration point
    this.thePlayer.anchor.set(0.5);

    this.thePlayer.radius = 24;
    this.thePlayer.mass = 1;
    this.thePlayer.vx = 0;
    this.thePlayer.vy = 0;

    this.thePlayer.play('right');
    this.item_array.push(this.thePlayer);

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
    var titleText = game.add.bitmapText(game.width / 2, game.height / 5, "font", "Up!", 48);

    // setting titleText anchor point to 0.5 (the centre)
    titleText.anchor.set(0.5);

    // adding titleText to startScreenGroup group
    this.startScreenGroup.add(titleText);

    // same thing goes with infoText
    var infoText = game.add.bitmapText(game.width / 2, game.height / 5 * 2, "font", "Start with Space / Tap / Click", 24);
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

    // waiting for player input, then call gameOn function
    game.input.onDown.addOnce(this.gameOn, this);
    var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key1.onDown.addOnce(this.gameOn, this);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

  },
  // function to be executed at each frame
  update: function(){
    if(this.isTheGameRunning){
      //control the player
      acc = 0.05;
      this.score++;
      if (upKey.isDown || this.upbuttonpressed == true)
      {
        this.thePlayer.vy-=acc;
        this.score++;
      }
      else if (downKey.isDown || this.downbuttonpressed == true)
      {
        this.thePlayer.vy+=acc;
        this.score++;
      }

      if (leftKey.isDown || this.leftbuttonpressed == true)
      {
        this.thePlayer.vx-=acc;
        this.score++;
      }
      else if (rightKey.isDown || this.rightbuttonpressed == true)
      {
        this.thePlayer.vx+=acc;
        this.score++;
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
          if ( Math.abs(item.x - this.whitehole.x) < 20 && Math.abs(item.y - this.whitehole.y) < 20) {
              item.isShrunk = true;
              this.taikoCSound.play();
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
      if (isGameOver){this.gameOver();}
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
    this.taikoCSound.play();
    this.thePlayer.play('right');
    this.thePlayer.vx = 0;
    this.thePlayer.vy = 0;

    game.time.events.add(Phaser.Timer.SECOND * 600 ,this.gameOver, this);


    // waiting for player input, then call gameOn function
    //	game.input.onDown.add(this.heroJump, this);

    //	var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //	key1.onDown.add(this.heroJump, this);

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

  restart: function(){
    this.score = 9999;
    this.gameOver();
  },

  gameOver: function(){

    this.isTheGameRunning = false;
  //  this.thePlayer.animations.stop();


    // updating localstorage setting score as the max value between current score and saved score
    localStorage.setItem(gameOptions.localStorageName,JSON.stringify({
      score: Math.min(this.score, this.savedData.score)
    }));

    // wait ... seconds before restarting the game
    game.time.events.add(Phaser.Timer.SECOND * 1, function(){
      game.state.start("TheGame");
    }, this);




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
  calculate_new_velocity: function(object_1, object_2)
  {

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

        this.taikoCSound.play();

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
