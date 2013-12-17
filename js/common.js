var canvas = document.getElementById('game_canvas'),
	bgCanvas = document.getElementById('bg_canvas'), //$('#bg_canvas').get(0).getContext('2d'),
	cw = canvas.width,
	ch = canvas.height,

	framerate = 30,
	
	keys = {
		up: 	38,
		down: 	40,
		left: 	37,
		right: 	39,
		space: 	32,
		enter: 	13,
		z: 		90,
		x: 		88,
		c: 		67
	},

	bullets = [],
	actors = [],
	items = [],
	
	player, enemy, level, stage, camera, emitter;

function Level(img, startX, startY)
{
	if(!img)
	{
		console.log('Error! No level image');
		return false;
	}
	this.bgGraphic = new createjs.Bitmap(img);
	
	this.bg = new createjs.Stage(bgCanvas);
	this.stage = new createjs.Stage(canvas);

	this.bg.x = startX || 0;
	this.bg.y = startY || 0;

	this.world = new createjs.Rectangle(
		0,
		0, 
		this.bgGraphic.x + this.bgGraphic.image.width, 
		this.bgGraphic.y + this.bgGraphic.image.height
	);

	this.bg.addChild(this.bgGraphic);
	this.bg.update();
}
	//Add child to level
	Level.prototype.add = function(child)
	{
		child.x = this.world.x + child.x;
		child.y = this.world.y + child.y;
		this.stage.addChild(child);
	}

	Level.prototype.remove = function(child)
	{
		this.stage.removeChild(child);
	}

	Level.prototype.update = function()
	{
		var prevX = this.bg.x,
			prevY = this.bg.y,
			dx = this.world.x - camera.position.x,
			dy = this.world.y - camera.position.y;

		this.bg.x = dx;
		this.bg.y = dy;

		if(prevX !== this.bg.x || prevY !== this.bg.y)
		{
			//Move level
			this.bg.update();	
			
			//Move characters, items etc
			this.stage.x = this.world.x - camera.position.x;
			this.stage.y = this.world.y - camera.position.y;
		}
		
		this.stage.update();
	}

//Game elements

function Item(options)
{
	this.type = 'health';
	this.val = 1;
	this.life = 5;
	
	parseOptions(this, options);

	this.life *= framerate;

	this.bitmaps = {
		health: 'images/health.png',
		weapon: 'images/weapon.png'
	};

	this.skin = new createjs.Bitmap(this.bitmaps[ this.type ]);
}

	Item.prototype.checkPickup = function()
	{
		if(player.skin.x)
		{
			
		}
	}

	Item.prototype.pickup = function()
	{
		switch(this.type)
		{
			case 'weapon':
				if(player.weapon.type !== this.val)
				{
					//Picked up new weapon
					player.weapon = new Weapon(this.val);
					
					return true;
				}
			break;
			
			case 'health':
				if(player.health < player.maxHealth)
				{
					player.health += this.val;
					
					if(player.health > player.maxHealth)
					{
						player.health = player.maxHealth;
					}
					
					return true;
				}	
			break;
		}
		
		return false;
	}
	
	Item.prototype.update = function(idx)
	{
		this.life--;
		if(!this.life)
		{
			level.remove(this.skin);	
			items.splice(idx, 1);
			return;
		}

		if(testCollision(player, item))
		{
			if(item.pickup())
			{
				items.splice(i,1);	//Item picked up, remove from pool
				continue;
			}
		}

		if(this.life < 1 * framerate)
		{
			//Start fading
			this.skin.alpha -= 0.1;
		}
		
	}

function Bullet(options) {
	this.damage = 10;
	this.speed = 20;
	this.angle = 1;
	this.evil = false;
	this.life = 0.5;
	this.skin = new createjs.Bitmap('images/bullet.png');
	
	parseOptions(this, options);

	this.life *= framerate;

	level.add(this.skin);
	
	bullets.push(this);
}

	Bullet.prototype.update = function(idx)
	{
		if(!this.life)
		{
			level.remove(this.skin);	
			bullets.splice(idx, 1);
			return;
		}
		
		this.skin.y -= (this.evil) ? -this.speed : this.speed;
		
		//testCollision(this, actors);
		this.life--;
		if(this.life < 5)
		{
			this.skin.alpha -= 0.25;
		}
	}
	
function Weapon(parent, type) 
{
	if(!parent)
	{
		console.log('Error! Weapon has no parent');
	}

	this.parent = parent;
	this.type = type || 'machinegun';
	this.maxAmmo = 999;
	this.bulletOptions = {};
	
	switch(this.type)
	{
		case 'pistol':
			this.bulletOptions.damage = 10;
			this.spawnRate = 600;
			this.fireRate = 1;
			this.ammo = -1;	//Infinite ammo
		break;
		
		case 'machinegun':
			this.bulletOptions.damage = 4;
			this.spawnRate = 100;
			this.fireRate = 2;
			this.ammo = 100;
		break;
	}
}
	Weapon.prototype.addAmmo = function(amount)
	{
		if(this.ammo < this.maxAmmo)
		{
			this.ammo += amount;
		}
	}

	Weapon.prototype.fire = function() {
		var self = this;
		
		var numBullets = this.fireRate;
		this.bulletOptions.skin = { 
			x: this.parent.skin.x, 
			y: this.parent.skin.y
		};

		new Bullet(this.bulletOptions);
		
		if(this.fireRate > 1)
		{
			var bulletSpawner = setInterval(function() {
				if(!numBullets)
				{
					clearTimeout(bulletSpawner);
					return;
				}
				new Bullet(self.bulletOptions);
				numBullets--;
			}, this.spawnRate);	
		}
		
	}

//Actor is a character, either player or enemy	
function Actor(name) {
	this.name = name || 'Unnamed actor';

	this.velocity = new createjs.Point(0,0);

	this.initPos = new createjs.Point(300,300);
	
	this.spriteSheet = null;
	this.skin = null;		
};

	Actor.prototype.init = function() {
		//Create spritesheet
		this.spriteSheet = new createjs.SpriteSheet(this.spriteData);
		
		createjs.SpriteSheetUtils.addFlippedFrames(this.spriteSheet, true, false, false);	//Flip frames horizontally
		this.skin = new createjs.BitmapAnimation(this.spriteSheet);	
			
		this.skin.x = this.initPos.x;
		this.skin.y = this.initPos.y;
		
		this.skin.gotoAndPlay('idle');

		level.add(this.skin);
		actors.push(this);
	};

	Actor.prototype.update = function() {
		console.log('Actor ' + this.name + ' does nothing');
	};
		
//Allows parallax scrolling, not used in this game
var ScrollingImage = function(scrolledImage, context, canvasSize, clear)
{
	this.context = context;
	this.clear = clear || false;
	this.speed = new createjs.Point(0, 0);
	this.image = new Image();
	this.image.src = scrolledImage;
	
	this.x = 0;
	this.y = 0;
	
	this.cW = canvasSize[0];
	this.cH = canvasSize[1];
};

ScrollingImage.prototype.setSpeed = function(speed)
{
	this.speed = speed;
};

ScrollingImage.prototype.update = function() {		
	this.x -= this.speed.x;
	this.y -= this.speed.y;
	
	if(this.clear)
	{
		this.context.clearRect(0, 0, this.cW, this.cH);	
	}
	this.context.drawImage(this.image, this.x, this.y);

	// Draw another image at the edge of the first image
	var xPos = (this.x < 0) ? this.x + this.cW - 1 : this.x - this.cW + 1,
		yPos = (this.y < 0) ? this.y + this.cH - 1 : this.y - this.cH + 1;

	this.context.drawImage(this.image, xPos, this.y);
	this.context.drawImage(this.image, this.x, yPos);
	this.context.drawImage(this.image, xPos, yPos);
	
	// If the image scrolled off the screen, reset
	if(this.x >= this.cW || this.x <= -this.cW)
	{
		this.x = 0;
	}

	if(this.y >= this.cH || this.x <= -this.cH)
	{
		this.y = 0;
	}	
};