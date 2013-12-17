//Particle effects
var Emitter = function(options)
{
	this.x = 0;
	this.y = 0;
	this.angle = 0;
	this.angleVariation = Math.PI * 2;
	this.size = 2;
	this.life = 50;
	this.lifeVariation = 0.5;
	this.speed = [5, -5];
	this.spawnRate = 1;
	this.spawnAmount = 10;
	this.maxParticles = 100;
	this.particles = [];

	if(typeof options === 'object')
	{		
		for(var prop in options)
		{
			this[prop] = options[prop];
		}
	}
};

Emitter.prototype.setPos = function(x, y)
{
	this.x = x || this.x;
	this.y = y || this.y;
}

Emitter.prototype.createParticle = function()
{
	if(this.particles.length < this.maxParticles)
	{	
		var particle = new createjs.Shape();
		
		var color = [255,255,255]; //generateColor(100, 255);
		
/* 	    particle.graphics.beginFill(createjs.Graphics.getRGB(color[0], color[1], color[2])); */
/*
		var color1 = createjs.Graphics.getRGB(color[0], color[1], color[2], 1);
		var color2 = createjs.Graphics.getRGB(color[0], color[1], color[2], 0.1);
		particle.graphics.beginRadialGradientFill([color1, color2], [0, 1], 0, 0, 0, this.size/2, this.size/2, this.size)
						.drawCircle(0, 0, this.size);
*/
		particle = new createjs.Bitmap('application/assets/images/smoke_puff.png');
		particle.scaleX = this.size/10;
		particle.scaleY = this.size/10;
	
		particle.x = this.x;
		particle.y = this.y;
		particle.angle = randomVariation(this.angle, this.angleVariation);
		particle.speedX = this.speed[0];
		particle.speedY = this.speed[1];
		particle.time = createjs.Ticker.getTime() / 1000;
		particle.life = randomVariation(this.life, this.life * this.lifeVariation);
		particle.alpha = 0.5;
	
		stage.addChild(particle);	
		this.particles.push(particle);
	}
	
};

Emitter.prototype.update = function() {
	var elapsed = createjs.Ticker.getTime() / 1000;
	
	var newParticlesThisFrame = elapsed * this.spawnRate;
	for (var i = 0; i < newParticlesThisFrame; i++) 
	{
	    this.createParticle();
	}
	
	for(var i = 0; i < this.particles.length; i++)
	{
		var particle = this.particles[i];
		var pos = makeAngle(particle.angle * player.direction, particle.speedX, particle.speedY);

		particle.x += pos.x;
		particle.y += pos.y;
		particle.life -= (elapsed - particle.time);
		particle.alpha -= 1/particle.life;
		
		if(particle.life <= 0)
		{
			//Particle has expired
			stage.removeChild(particle);
			this.particles.splice(i, 1);
		}
	}
	
};