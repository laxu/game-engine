var Player = function() {
	this.health = 5;
	this.weapon = new Weapon(this);
	this.state = 'idle';

	this.direction = new createjs.Point(1,1);

	this.speed = 5;
	this.velocity = new createjs.Point(0,0);
	this.initPos = new createjs.Point(300, 700);
	this.moveLimits = new createjs.Point(50, 50);
	
	this.spriteData = {
		images: [ 'images/player.png' ],
		frames: {
			width:	64, 
			height:	64,
			regX:	32,
			regY:	32
		},
		animations: 
		{
			walk:[0,1, 'walk', 2],
			idle: [0, 1, 'idle', 2]
		}
	};
	
	this.init();
	this.bindEvents();
};

Player.prototype = new Actor('Player');
Player.prototype.constructor = Player;
			
Player.prototype.bindEvents = function()
{	
	var playerEvents = {
		down: function(e) {
			switch(e.keyCode)
			{
				case keys.right:
					if(this.velocity.x !== this.speed)
					{	
						this.state = 'walk';
						this.direction.x = 1;
						this.velocity.x = this.speed;
					}
				break;

				case keys.left:
					if(this.velocity.x !== -this.speed)
					{
						this.state = 'walk';
						this.direction.x = -1;
						this.velocity.x = -this.speed;
					}	
				break;

				case keys.up:
					if(this.velocity.y !== -this.speed)
					{
						this.state = 'walk';
						this.direction.y = 1;
						this.velocity.y = -this.speed;
					}
				break;
				case keys.down:
					if(this.velocity.y !== -this.speed)
					{
						this.state = 'walk';
						this.direction.y = -1;
						this.velocity.y = this.speed;
						
					}
				break;
				case keys.z:
					this.weapon.fire();
				break;				
			}
		},
		up: function(e) {
			switch(e.keyCode)
			{
				case keys.right:
				case keys.left:
					this.state = 'idle';
					this.velocity.x = 0;
				break;

				case keys.up:
				case keys.down:
					this.state = 'idle';
					this.velocity.y = 0;
				break;

			}
		}
	};
	
	var downEvent = $.proxy(playerEvents.down, this),
		upEvent = $.proxy(playerEvents.up, this),
		touchStartEvent = $.proxy(playerEvents.touchStart, this),
		touchEndEvent = $.proxy(playerEvents.touchEnd, this);
		
	$('body').on('keydown', downEvent)
			.on('keyup', upEvent)
			.on('touchstart', touchStartEvent)
			.on('touchend', touchEndEvent);
};

Player.prototype.update = function() {

	//Move player
	this.skin.x += this.velocity.x;
	this.skin.y += this.velocity.y;
	

	//Prevent player from moving beyond world boundaries
	if(this.skin.x < level.world.x + this.moveLimits.x)
	{
		this.skin.x = this.moveLimits.x;
	}
	else if(this.skin.x > level.world.width - this.moveLimits.x)
	{
		this.skin.x = level.world.width - this.moveLimits.x;
	}

	if(this.skin.y < level.world.y + this.moveLimits.y)
	{
		this.skin.y = this.moveLimits.y;
	}
	else if(this.skin.y > level.world.height - this.moveLimits.y)
	{
		this.skin.y = level.world.height - this.moveLimits.y;
	}
	
};