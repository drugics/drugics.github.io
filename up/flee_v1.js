// author: trurl@h7.hu
//physics param
var spring_constant = 8;
var fast_collision_from = 1;
var resistance = 0.9999;

//const
var canvas_left = 35;
var canvas_top  = 35;
var canvas_size_x = 400;
var canvas_size_y = 400;
var cursor_radius = 10;
var color_bad = 'rgb(190, 140, 0)';
var color_good = 'rgb(120, 160, 255)';
var game_speed = 0;
var speed_increment = 0.1;
var number_of_rows = 5;
var number_of_columns = 5;
var number_of_bads = number_of_rows * number_of_columns;
var cursor_start_x = 20;
var cursor_start_y = 20;
var frame_per_sec =18 ;

//glob vars
var ctx;
var pe;
var item_array;
var cursor_x = cursor_start_x;
var cursor_y = cursor_start_y;

//Create page after window load.----------------------------

Event.observe(window, 'load', function(event) {
		
	var canvas = new Element('canvas', {id : 'canvas1'});
	canvas.height = canvas_size_y;
	canvas.width = canvas_size_x;
	canvas.setStyle({
	  position: 'absolute',
	  cursor: 'none',
	  left: canvas_left + 'px',
	  top: canvas_top + 'px'
	});
	canvas.observe('mousemove',function(event) {
		cursor_x = event.pageX - canvas_left;
		cursor_y = event.pageY - canvas_top;
	});
	
	$("body").insert( canvas );

	ctx = canvas.getContext("2d");

	//a link to home
	var link_to_home = new Element('a', {id : 'link_to_home', href : '../index.html', title : 'More games.'});
	var home_logo = new Element('div', {id : 'home_logo'});
	link_to_home.insert(home_logo);		
//	$("body").insert( link_to_home );

	//a link to source
	var link_to_source = new Element('a', {id : 'link_to_source', href : './javascripts/flee_v1.js', title : 'View the source code of the game.'});
	link_to_source.insert('source code');	
	link_to_source.observe('click', function(event){
		new Ajax.Request('../analytics/game_stat.php?view=source', {});
	});
	$("body").insert( link_to_source );


	//starter screen
	machine_won();		

})

//------------------------------------------------------------------------
function start_new_game() {
	
	//write game stats
	new Ajax.Request('../analytics/game_stat.php', {});
	



	cursor_x = cursor_start_x;
	cursor_y = cursor_start_y;
	
	item_array = new Array();
	//put up objects
	var density = 0.01;
	for (var j = 0; j < number_of_rows; j++)
	{
		for (var i = 0; i < number_of_columns; i++)
		{
			var radius = 3 + Math.random()*30;
			item_array.push( {  vx : game_speed*speed_increment + Math.random(), vy : game_speed*speed_increment + Math.random(),
								  sx : 100 + i*50, sy: 100 + j*50,
									mass: Math.pow(radius,2) * density,
									radius: radius,
									type: 'bad',
									 } );
		}
	}

	for (var i = 0; i < number_of_columns; i++)
	{
		item_array.push( {  vx : game_speed*speed_increment + Math.random()*2, vy : game_speed*speed_increment + Math.random()*2,
					  sx : 100 + i*50, sy: 350,
						mass: 0.25,
						radius: 5,
						type: 'good',
						 } );
	}

	start_animation();

}
//------------------------------------------------------------------------
function calculate_new_place(item) {
	item.sx += item.vx;
	item.sy += item.vy;
}

//--------------------------------------------------------------------------------------------
function calculate_new_velocity_walls(item) {
	
	var top = item.sy - item.radius;
	var bottom = item.sy + item.radius;
	var leftSide = item.sx - item.radius;
	var rightSide = item.sx + item.radius;
	
	if (top < 0 && item.vy < 0)
	{
		item.vy *= -1; 
	}
	else if ( bottom > canvas_size_y && item.vy > 0)
	{
		item.vy *= -1; 
	}
		
	if (leftSide < 0 && item.vx < 0 )
	{
		item.vx *= -1; 
	}
	else if ( rightSide > canvas_size_x && item.vx > 0)
	{

		item.vx *= -1; 
	}
}


//--------------------------------------------------------------------------------------------
function calculate_new_velocity_ease(item)
{
	if ( Math.abs(item.vx) > 0.01)
	{
		item.vx *= resistance;
	}
	if ( Math.abs(item.vy) > 0.01)
	{
		item.vy *= resistance;
	}
}
//--------------------------------------------------------------------------------------------
function calculate_new_velocity(object_1, object_2)
{

	var distance_x = object_2.sx-object_1.sx;
	var distance_y = object_2.sy-object_1.sy;
	var distance = Math.sqrt( Math.pow(distance_x,2) + Math.pow(distance_y,2) ) ;
	var collision_distance = ( object_1.radius + object_2.radius );

	if( distance != 0	&& distance < collision_distance ) // touch
	{ 

		var fAbsPerDistance = ( 1 - distance/collision_distance ) * -spring_constant / distance;
		force1_fx =  fAbsPerDistance * distance_x;
		force1_fy =  fAbsPerDistance * distance_y;

		var object_1_ax = force1_fx /object_1.mass ;
		var object_1_ay = force1_fy /object_1.mass ;
		var object_2_ax = force1_fx /object_2.mass ;
		var object_2_ay = force1_fy /object_2.mass ;
			
		if ( Math.max( Math.abs(object_1_ax), Math.abs(object_1_ay), Math.abs(object_2_ax), Math.abs(object_2_ay) ) < fast_collision_from
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

			var tmp_polar_v_object_1 =  cartesian_to_polar_coordinates(tmp_cartesian_v_object_1);
			var tmp_polar_v_object_2 =  cartesian_to_polar_coordinates(tmp_cartesian_v_object_2);

			tmp_polar_v_object_1.angle -= angle_to_rotate_coordinate_system;
			tmp_polar_v_object_2.angle -= angle_to_rotate_coordinate_system;
			
			tmp_cartesian_v_object_1 = polar_to_cartesian_coordinates(tmp_polar_v_object_1);
			tmp_cartesian_v_object_2 = polar_to_cartesian_coordinates(tmp_polar_v_object_2);

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
			tmp_polar_v_object_1 =  cartesian_to_polar_coordinates(tmp_cartesian_v_object_1);
			tmp_polar_v_object_2 =  cartesian_to_polar_coordinates(tmp_cartesian_v_object_2);

			tmp_polar_v_object_1.angle += angle_to_rotate_coordinate_system;
			tmp_polar_v_object_2.angle += angle_to_rotate_coordinate_system;

			tmp_cartesian_v_object_1 = polar_to_cartesian_coordinates(tmp_polar_v_object_1);
			tmp_cartesian_v_object_2 = polar_to_cartesian_coordinates(tmp_polar_v_object_2);

			
			object_1.vx = tmp_cartesian_v_object_1.x;
			object_1.vy = tmp_cartesian_v_object_1.y;
			
			object_2.vx = tmp_cartesian_v_object_2.x;
			object_2.vy = tmp_cartesian_v_object_2.y;
		
		}

	}
	
}

//-----------------------------------------------
function cartesian_to_polar_coordinates(cartesian_coordinates){
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

}
//-----------------------------------------------
function polar_to_cartesian_coordinates(polar_coordinates){

	var cartesian_coordinates  = {x:0, y:0};
	cartesian_coordinates.x = Math.sin(polar_coordinates.angle) * polar_coordinates.len;
	cartesian_coordinates.y = Math.cos(polar_coordinates.angle) * polar_coordinates.len;
	return cartesian_coordinates;

}
//set and start animation-----------------------------------------------
function start_animation(){

	peCalc = new PeriodicalExecuter(function(pe)
	{

		for (var index = 0, len = item_array.length; index < len; ++index) {
			var item = item_array[index];
			for (var indexAffector = index + 1; indexAffector < len; ++indexAffector) {
				var itemAffector = item_array[indexAffector];
			
				calculate_new_velocity(item, itemAffector);
			}
			calculate_new_velocity_walls(item);
			// no ease... calculate_new_velocity_ease(item);
		}
		
		item_array.each(function(item){
			calculate_new_place(item);
		});

		ctx.clearRect(0,0,canvas_size_x - 1,canvas_size_y - 1);
			
		redraw_canvas();
		
		//check cursor collision
		var delete_indexes = new Array;
		for (var i = 0; i < item_array.length; i++)
		{
			if (check_cursor_collision( item_array[i]) )// delete if collided with a 'good'one
			{
				delete_indexes.push(i);
			}
		}
		
		for (var i = 0; i < delete_indexes.length; i++)
		{
			delete item_array[delete_indexes[i]]; 
			item_array = item_array.compact();
		}
		
		check_cursor_collision_walls();		

	}, 1/frame_per_sec );
	
}

//--------------------------------------------------------
function check_cursor_collision(item)
{
	var distance_x = item.sx-cursor_x;
	var distance_y = item.sy-cursor_y;
	var distance = Math.sqrt( Math.pow(distance_x,2) + Math.pow(distance_y,2) ) ;
	var collision_distance = ( item.radius + cursor_radius );

	if( distance < collision_distance ) // touch
	{
		if (item.type == 'bad')
		{
			stop_animation();
			machine_won();
		}
		else
		{
				
			//check if all goods are collected
			if (item_array.length == number_of_bads + 1)
			{
				stop_animation();
				human_won();
			}

			return true;
		}
	}

}
//--------------------------------------------------------
function check_cursor_collision_walls()
{

	if(
		cursor_x - cursor_radius < 0
		||
		cursor_y - cursor_radius < 0
		||
		cursor_x + cursor_radius > canvas_size_x
		||
		cursor_y + cursor_radius > canvas_size_y
	 ) 
	{
		stop_animation();
		machine_won();
	}

}
//--------------------------------------------------------
function stop_animation(){
	
	peCalc.stop();

}

//--------------------------------------------------------
function redraw_canvas(){

	item_array.each(function(item){
		redraw_item(item);		
	});
	redraw_cursor();	
	//redraw canvas frame	
	ctx.strokeStyle = color_bad;
	ctx.strokeRect(0,0,canvas_size_x - 1 ,canvas_size_y -1);

}

//--------------------------------------------------------
function redraw_cursor()
{
		ctx.strokeStyle = color_good;
		ctx.beginPath();    
		ctx.arc(cursor_x, cursor_y, cursor_radius, 0, Math.PI*2, true);
		ctx.stroke();
}

//--------------------------------------------------------
function redraw_item(item)
{
		if (item.type == 'bad')
		{
			ctx.strokeStyle = color_bad;
		}
		else
		{
			ctx.strokeStyle = color_good;
		}
		ctx.beginPath();    
		ctx.arc(item.sx, item.sy, item.radius, 0, Math.PI*2, true);
		ctx.stroke();
}

//-----------------------------------------
function human_won()
{
				
	new Ajax.Request('../analytics/game_stat.php?s=y'+game_speed, {});
	
	document.body.setAttribute("class", "unlocked");

	//dimmer
	var div = new Element('div', {id : 'machine_won'});
	$("body").insert(div);

	div.setStyle({
	  backgroundColor: 'rgb(210,210,210)',
	  opacity: '0.15', 
	  position: 'absolute',
	  left: canvas_left + 'px',
	  top: canvas_top + 'px',
	  width: canvas_size_x + 'px',
	  height: canvas_size_y + 'px'
	});
	
	//icon
	var image = new Image();
	image.src = "images/icons/go-up.png";///usr/share/icons/Human/48x48

	image.setStyle({
		cursor: 'pointer',
		position: 'absolute',
		left: canvas_left + 'px',
		top: canvas_top + 'px'
	});

	$("body").insert(image);
		
	image.observe('click', function(event){
		game_speed++;
		document.title = "Flee, Level "+game_speed;
		start_new_game();
		div.remove();
		image.remove();
	});
			

}
//------------------------------------------
function machine_won()
{
	//dimmer
	var div = new Element('div', {id : 'machine_won'});
	$("body").insert(div);

	div.setStyle({
	  backgroundColor: 'rgb(210,210,210)',
	  opacity: '0.15', 
	  position: 'absolute',
	  left: canvas_left + 'px',
	  top: canvas_top + 'px',
	  width: canvas_size_x + 'px',
	  height: canvas_size_y + 'px'
	});
	
	//icon
	var image = new Image();
	image.src = "images/icons/reload.png";

	image.setStyle({
		cursor: 'pointer',
		position: 'absolute',
		left: canvas_left + 'px',
		top: canvas_top + 'px'
	});
	
	image.observe('click', function(event){
		start_new_game();
		div.remove();
		image.remove();
	});

	$("body").insert(image);
	
}

