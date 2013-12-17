function Camera(options, deadzoneX, deadzoneY)
{
	this.followed = null;
	this.position = new createjs.Point(0, 0);				//Position of camera (left-top coordinate)
	this.viewport = new createjs.Rectangle(0, 0, cw, ch);
	this.deadzone = new createjs.Point(deadzoneX || cw/2, deadzoneY || ch/2);	//Distance from followed object to level border before camera starts move

	parseOptions(this, options);

};

Camera.prototype.follow = function(target)
{
	followed = target;
};

Camera.prototype.within = function(r) {

	return (
		r.x 	<= this.viewport.x && 
		r.width >= this.viewport.x + this.viewport.width &&
		r.y 	<= this.viewport.y && 
		r.height >= this.viewport.y + this.viewport.height
	);
};

//Move camera if needed
Camera.prototype.update = function() 
{
	var followed = this.followed,
		pos = this.position,
		prevX = pos.x,
		prevY = pos.y,
		world = level.world;

	
	if(followed.x - pos.x  + this.deadzone.x > this.viewport.width)
	{
		pos.x = followed.x - (this.viewport.width - this.deadzone.x);
	}
	else if(followed.x  - this.deadzone.x < pos.x)
	{
		pos.x = followed.x  - this.deadzone.x;
	}
	
	//Moves camera on vertical axis based on followed object position
	if(followed.y - pos.y + this.deadzone.y > this.viewport.height)
	{
		pos.y = followed.y - (this.viewport.height - this.deadzone.y);
	}
	else if(followed.y - this.deadzone.y < pos.y)
	{
		pos.y = followed.y - this.deadzone.y;
	}								
					
			
	//Update viewport
	this.viewport.x = pos.x;
	this.viewport.y = pos.y;
	
	//Keep camera within world boundaries
	if(!this.within(world))
	{
		if(this.viewport.x < world.x)
		{
			pos.x = world.x;
		}
		if(this.viewport.y < world.y)
		{
			pos.y = world.y;
		}
		if(this.viewport.x + this.viewport.width > world.width)
		{
			pos.x = world.width - this.viewport.width;
		}
		if(this.viewport.y + this.viewport.height > world.height)
		{
			pos.y = world.height - this.viewport.height;
		}
	}
	
};