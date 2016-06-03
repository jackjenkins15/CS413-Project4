var WIDTH = 720;
var HEIGHT = 720;
var SCALE = 3;
var DIM = 18;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = SCALE;
stage.scale.y = SCALE;

//Different screne containers
var menu = new PIXI.Container();
var game = new PIXI.Container();
var instructions = new PIXI.Container();
var credits = new PIXI.Container();
var lasers = new PIXI.Container();
var monsters = new PIXI.Container();

// Scene objects get loaded in the ready function
    var title_text;
    var game_button;
    var controls_button;
    var credits_button;
    var menu_button;
    
    var player;       
    var monster;
    var lastdirection;
    var all_lasers = [];
    
    var world;
    var entities;
    var wall_layer = [];
    //var collisionindex = [];
    
    var objective_text;
    var controls_text;
    
    var credits_text;
    var author_text;

    var lazershot;
    var startupgame;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
    .add('map.json')
    .add('tileset.png')
    .add('player_assests.json')
    .add('monster_assests.json')
    //.add('tiles_lazershot.mp3')
    //.add('tiles_startupgame.mp3')
    .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);

  
  //MENU SCREEN SETUP
      title_text = new PIXI.Text("The Dude");
      title_text.position.x = 125;
      title_text.position.y = 50;
      title_text.anchor.x = 0;
      title_text.anchor.y = 1;
      
      game_button = new PIXI.Sprite(PIXI.Texture.fromImage("game_button.png"));
      game_button.position.x = 150;
      game_button.position.y = 150;
      game_button.anchor.x = 0;
      game_button.anchor.y = 1;
      
      controls_button = new PIXI.Sprite(PIXI.Texture.fromImage("control_button.png"));
      controls_button.position.x = 150;
      controls_button.position.y = 250;
      controls_button.anchor.x = 0;
      controls_button.anchor.y = 1;
      
      credits_button = new PIXI.Sprite(PIXI.Texture.fromImage("credits_botton.png"));
      credits_button.position.x = 150;
      credits_button.position.y = 350;
      credits_button.anchor.x = 0;
      credits_button.anchor.y = 1;
      
    //GAME SCREEN SETUP
      //setting up world map
      var tu = new TileUtilities(PIXI);
      world = tu.makeTiledWorld("map.json", "tileset.png");
      
      
      //setting up player
      var move_up = [];
      move_up.push(PIXI.Texture.fromFrame('jackchar4.png'));
      move_up.push(PIXI.Texture.fromFrame('jackchar5.png'));
      move_up.push(PIXI.Texture.fromFrame('jackchar6.png'));
      var move_down = [];
      move_down.push(PIXI.Texture.fromFrame('jackchar1.png'));
      move_down.push(PIXI.Texture.fromFrame('jackchar2.png'));
      move_down.push(PIXI.Texture.fromFrame('jackchar3.png'));
      var move_left = [];
      move_left.push(PIXI.Texture.fromFrame('jackchar9.png'));
      move_left.push(PIXI.Texture.fromFrame('jackchar10.png'));
      var move_right = [];
      move_right.push(PIXI.Texture.fromFrame('jackchar7.png'));
      move_right.push(PIXI.Texture.fromFrame('jackchar8.png'));
      
      player = new PIXI.extras.MovieClip(move_down);
      player.animationSpeed = 0.1 
      
      player.gx = 9;
      player.gy = 5;
      player.x = player.gx*DIM;
      player.y = player.gy*DIM;
      player.collisionArea = {x: player.x,y: player.y,width:18,height:18};
      player.anchor.x = 0;
      player.anchor.y = 1;
      player.x = 20;
      player.y = 60;
      
      //setting up the collision tiles
      entities = world.getObject("Entities");
      entities.addChild(player);
      entities.addChild(monsters);
      entities.addChild(lasers);
      
      wall_layer = world.getObject("walls").data;
      
      var monster_move = [];
      monster_move.push(PIXI.Texture.fromFrame("slime1.png"));
      monster_move.push(PIXI.Texture.fromFrame("slime2.png"));
      monster_move.push(PIXI.Texture.fromFrame("slime3.png"));
      monster_move.push(PIXI.Texture.fromFrame("slime4.png"));      
      
      //last monster
      monster = new PIXI.extras.MovieClip(monster_move);
      monster.animationSpeed =0.1;
      monster.gx = 9;
      monster.gy = 5;
      monster.x = monster.gx*DIM;
      monster.y = monster.gy*DIM;
      monster.collisionArea = {x: monster.x,y: monster.y,width:18,height:18};
      monster.position.x = 140;
      monster.position.y = 635;
      monster.anchor.x = 0;
      monster.anchor.y = 1;
      monsters.addChild(monster);
      
      //first monster
      monster1 = new PIXI.extras.MovieClip(monster_move);
      monster1.animationSpeed =0.1;
      monster1.gx = 9;
      monster1.gy = 5;
      monster1.x = monster1.gx*DIM;
      monster1.y = monster1.gy*DIM;
      monster1.collisionArea = {x: monster1.x,y: monster1.y,width:18,height:18};
      monster1.position.x = 355;
      monster1.position.y = 175;
      monster1.anchor.x = 0;
      monster1.anchor.y = 1;
      monsters.addChild(monster1);
      
      //2nd monster
      monster2 = new PIXI.extras.MovieClip(monster_move);
      monster2.animationSpeed =0.1;
      monster2.gx = 9;
      monster2.gy = 5;
      monster2.x = monster2.gx*DIM;
      monster2.y = monster2.gy*DIM;
      monster2.collisionArea = {x: monster2.x,y: monster2.y,width:18,height:18};
      monster2.position.x = 643;
      monster2.position.y = 490;
      monster2.anchor.x = 0;
      monster2.anchor.y = 1;
      monsters.addChild(monster2);
      
      //3rd monster
      monster3 = new PIXI.extras.MovieClip(monster_move);
      monster3.animationSpeed =0.1;
      monster3.gx = 9;
      monster3.gy = 5;
      monster3.x = monster3.gx*DIM;
      monster3.y = monster3.gy*DIM;
      monster3.collisionArea = {x: monster3.x,y: monster3.y,width:18,height:18};
      monster3.position.x = 375;
      monster3.position.y = 380;
      monster3.anchor.x = 0;
      monster3.anchor.y = 1;
      monsters.addChild(monster3);
      
      //lazershot = PIXI.audioManager.getAudio('tiles_lazershot.mp3');
      //startupgame = PIXI.audioManager.getAudio('tiles_startupgame.mp3');


    //INSTRUCTION SCREEN SETUP    
      objective_text = new PIXI.Text("\tGoal:    \n\t\t\t\t Shoot all the aliens with your\n \t\t\t\tlazer gun and escape to win the game! \n\t\t\t\t ");      objective_text.position.x = 200;
      objective_text.position.y = 150;
      objective_text.anchor.x = 0.5;
      objective_text.anchor.y = 0.5;
      objective_text.scale.x = .75;
      objective_text.scale.y = .75; 
      
      controls_text = new PIXI.Text("\tControls:    \n\t\t\t\tTo move: use WASD\n\t\t\t To shoot: spacebar\n");
      controls_text.position.x = 200;
      controls_text.position.y = 250;
      controls_text.anchor.x = 0.5;
      controls_text.anchor.y = 0.5;
      controls_text.scale.x = .75;
      controls_text.scale.y = .75; 
      
    //CREDITS SCREEN SETUP
      menu_button = new PIXI.Sprite(PIXI.Texture.fromImage("menu_button.png"));
      menu_button.position.x = 150;
      menu_button.position.y = 350;
      menu_button.anchor.x = 0;
      menu_button.anchor.y = 1;
      menu_button.scale.x = 1;
      menu_button.scale.y = 1; 
      
      credits_text = new PIXI.Text("All design aspects are made by:\n Jack Jenkins");
      credits_text.position.x = 200;
      credits_text.position.y = 150;
      credits_text.anchor.x = 0.5;
      credits_text.anchor.y = 0.5;
      credits_text.scale.x = .75;
      credits_text.scale.y = .75; 

    player.direction = MOVE_NONE;
    player.moving = false;
  
  //start at the main menu
  mainmenuScreen();
  animate();
}

function shoot(){	
    
    var projectile = new PIXI.Sprite(PIXI.Texture.fromImage("laser.png"));
    projectile.position.x = player.position.x;
    projectile.position.y = player.position.y;
    projectile.x = player.x;
    projectile.y = player.y;
    projectile.collisionArea = 
    	{x: projectile.x,y: projectile.y,width:18,height:18};
    projectile.scale.x = 1.5;
    projectile.scale.y =1.5;
    
    if (lastdirection == MOVE_LEFT){
		projectile.rotation = 3.14159;
		projectile.anchor.x = player.anchor.x+0.5;
    	projectile.anchor.y = player.anchor.y-0.8;
		createjs.Tween.get(projectile.position).to({x: player.position.x-350, y: projectile.position.y}, 1000).call(move);
    } 
    if (lastdirection == MOVE_RIGHT){
  		projectile.rotation = 0;
  		projectile.anchor.x = player.anchor.x;
    	projectile.anchor.y = player.anchor.y-0.1;
  		createjs.Tween.get(projectile.position).to({x: projectile.position.x+350, y: projectile.position.y}, 1000).call(move);	    
  	}
  	if (lastdirection == MOVE_UP){
    	projectile.rotation = -1.5708;
    	projectile.anchor.x = player.anchor.x-0.50;
    	projectile.anchor.y = player.anchor.y-0.75;
    	createjs.Tween.get(projectile.position).to({x: projectile.position.x, y: projectile.position.y-350}, 1000).call(move);
  	} 
  	if (lastdirection == MOVE_DOWN){
    	projectile.rotation = 1.5708;	
    	projectile.anchor.x = player.anchor.x+0.75;
    	projectile.anchor.y = player.anchor.y-0.25;
    	createjs.Tween.get(projectile.position).to({x: projectile.position.x, y: projectile.position.y+350}, 1000).call(move);
  	}
 
 	check_impact();
    all_lasers.push(projectile);
    lasers.addChild(projectile);
    
}

function check_impact(){
    /*
    //check for lasers going out of bounds
    for (var i=0;i<all_lasers.length; i++){
          if (wall_layer[(all_lasers[i].gy+dy-1)*40 + (all_lasers[i].gx+dx)] != 0){
    		player.moving = false;
    		lasers.removeChild(all_lasers[i]);
        };
    };
    */	
    //check for lasers hitting monsters
    for (var i=0;i<all_lasers.length; i++){
        //sprite collision check for monster encounters 
  	if (SpriteCollision(all_lasers[i],monster1)){
	  	all_lasers[i].moving = false;
	  	lasers.removeChild(all_lasers[i]);
	  	monsters.removeChild(monster1)
	};
	if (SpriteCollision(all_lasers[i],monster)){
	  	all_lasers[i].moving = false;
	  	lasers.removeChild(all_lasers[i]);
	  	monsters.removeChild(monster);
	};
	if (SpriteCollision(all_lasers[i],monster2)){
	  	all_lasers[i].moving = false;
	  	lasers.removeChild(all_lasers[i]);
	  	monsters.removeChild(monster2);
	};
	if (SpriteCollision(all_lasers[i],monster3)){
	  	all_lasers[i].moving = false;
	  	lasers.removeChild(all_lasers[i]);
	  	monsters.removeChild(monster3);
	};
    };
    //remove a laser if more than 10 in array (removes oldest laser)
    if (all_lasers.length > 10){
	all_lasers.splice(all_lasers.indexOf(i-9), 1);
    };
}

function SpriteCollision(sprite1, sprite2) {
  if(sprite1.x< sprite2.x +sprite2.width &&
    sprite1.x + sprite1.width > sprite2.x &&
    sprite1.y < (sprite2.y+18) + sprite2.height &&
    sprite1.height + sprite1.y > (sprite2.y+18)){
      return true;
    }
  else return false;
}

// The move function starts or continues movement
function move() {
  
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    return;
  }
  
  player.moving = true;
  player.play()
	
  var dx = 0;
  var dy = 0;
  
  if (player.direction == MOVE_LEFT){
  	//player.textures = move_left;
    dx -= 1;
  } 
  if (player.direction == MOVE_RIGHT){
  	//player.textures = move_right;
    dx += 1;
  }
  if (player.direction == MOVE_UP){
  	//player.textures = move_up;
    dy -= 1; 
  } 
  if (player.direction == MOVE_DOWN){
  	//player.textures = move_down;
    dy += 1;
  }
   
   //wall collision check
  if (wall_layer[(player.gy+dy-1)*40 + (player.gx+dx)] != 0) {
    player.moving = false;
  	return;
  }
    //sprite collision check for monster encounters 
  if (SpriteCollision(player,monster1) || SpriteCollision(player,monster) ||
  	SpriteCollision(player,monster2) || SpriteCollision(player,monster3)){
  	player.moving = false;
  	gameoverScreen();
  	return;
  }
    
  player.gx += dx;
  player.gy += dy;
  
  lastdirection = player.direction;

  createjs.Tween.get(player).to({x: player.gx*DIM, y: player.gy*DIM}, 250).call(move);
};

function inContainer(container,child){	
	
	for (var i=0;i<container.length; i++){
		if(child === container[i]){
			return true;
		}	
	}
};

function monstermove(){
	
	if (abs((player.x - monster1.x)) < 100 || abs((player.y - monster1.y)) < 100){
		monster1.moving = true;
		monster1.play()
  		createjs.Tween.get(monster1).to({x: monster1.position.x -10, y: monster1.position.y}, 1000).call(move);
	}
  	/*
  	monster1.moving = true;
  	monster2.moving = true;
  	monster3.moving = true;
  
  monster.play()
  createjs.Tween.get(monster).to({x: monster.position.x -10, y: monster.position.y}, 1000).call(move);

  monster1.play()
  createjs.Tween.get(monster1).to({x: monster1.position.x -10, y: monster1.position.y}, 1000).call(move);
  
  monster2.play()
  createjs.Tween.get(monster2).to({x: monster2.position.x -10, y: monster2.position.y}, 1000).call(move);
  
  monster3.play()
  createjs.Tween.get(monster3).to({x: monster3.position.x -10, y: monster3.position.y}, 1000).call(move);
  */
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;
  
  player.direction = MOVE_NONE;
  
  if (e.keyCode == 87){
    player.direction = MOVE_UP;
    }
  else if (e.keyCode == 83){
    player.direction = MOVE_DOWN;
    }
  else if (e.keyCode == 65){
    player.direction = MOVE_LEFT;
    }
  else if (e.keyCode == 68){
    player.direction = MOVE_RIGHT;
   }   
  else if (e.keyCode == 32){
   	shoot(); 
   }  
  move();
  
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
  player.stop();
});

function animate(timestamp) {
	requestAnimationFrame(animate);
	update_camera();
	renderer.render(stage);
}

//shows main menu
var mainmenuScreen = function(){
    cleanScreen();
    //add main menu to the stage(screen)
    stage.addChild(menu);
    stage.scale.x = 2;
    stage.scale.y = 2;
    
    
    //populate the main menu
    menu.addChild(title_text);
    menu.addChild(game_button);
    menu.addChild(controls_button);
    menu.addChild(credits_button);
    
    //button interactions, go to different screens on click
    game_button.interactive = true;
    game_button.on('mousedown', playScreen);
    controls_button.interactive = true;
    controls_button.on('mousedown', instructionsScreen);
    credits_button.interactive = true;
    credits_button.on('mousedown', creditsScreen);
}
//plays the game
var playScreen = function(){
    cleanScreen();
    
    //add game to the stage(screen)
    stage.addChild(game);
    
    stage.scale.x = SCALE;
    stage.scale.y = SCALE;
    
    //populate the game
    game.addChild(world);    
    game.addChild(player);
    game.addChild(lasers);
    game.addChild(monsters);
    
    //spawnMonsters();
    //startupgame.play();
}

var instructionsScreen = function(){
    cleanScreen();
    
    //add instructions to the stage(screen)
    stage.addChild(instructions);
    
    instructions.addChild(objective_text);
    instructions.addChild(controls_text);
    instructions.addChild(menu_button);
    
    //button interaction, go to menu screen on click
    menu_button.interactive = true;
    menu_button.on('mousedown', mainmenuScreen);
}

var creditsScreen = function(){
    cleanScreen();
    
    //add credits to the stage(screen)
    stage.addChild(credits);
    
    //populate Credits screen
    credits.addChild(credits_text);
    credits.addChild(menu_button);
    
    //button interaction, go to menu screen on click
    menu_button.interactive = true;
    menu_button.on('mousedown', mainmenuScreen);
}

//helper function to clean stage
var cleanScreen = function(){
    stage.removeChild(game);
    stage.removeChild(instructions);
    stage.removeChild(credits);
    stage.removeChild(menu);    
}

var gameoverScreen = function(){
	ready();
	mainmenuScreen();
}

function update_camera() {
  stage.x = -player.x*SCALE + WIDTH/2 - player.width/2*SCALE;
  stage.y = -player.y*SCALE + HEIGHT/2 + player.height/2*SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*SCALE - WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*SCALE - HEIGHT, -stage.y));
}
