
var Enemy = function(options) {
	this.health = 3;
	this.speed = 5;
	this.velocity = 0;
	this.initPos = [ 400, 300];
	
	
	this.spriteData = {
		images: [ 'application/assets/images/enemy.png' ],
		frames: {
			width:	64, 
			height:	64,
			regX:	32,
			regY:	32
		},
		animations: 
		{
			walk:[0,0, 'walk', 2],
		//	idle: [4, 7, 'idle', 10],
		//	jump: [8, 10, 'idle', 5]
		}
	};

	
	
	this.init();

};

Enemy.prototype = new Actor();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.ai = function() {


	if(this.velocity === 0)
	{
		//Start walking
		this.velocity = this.speed;
		this.skin.gotoAndPlay('walk');
	}

	if(this.skin.x >= (cw -	32))
	{
		//near edge, turn around
		this.velocity = -this.speed;
		this.skin.gotoAndPlay('walk_h');
	}
	else if(this.skin.x <= 32)
	{
		this.velocity = this.speed;
		this.skin.gotoAndPlay('walk');
	}
};

Enemy.prototype.update = function() {

	this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
	var center = this.body.GetWorldCenter();
	
	this.skin.x = center.x * box2d.constants.scale;
	this.skin.y = center.y * box2d.constants.scale;
	
	this.ai();
	
	var vel = this.body.GetLinearVelocity(),
	velChange = this.velocity - vel.x,
	impulse = this.body.GetMass() * velChange; //disregard time factor

	if(impulse)
	{
		this.body.ApplyImpulse( new b2Vec2(impulse, 0), center );	
	}

};