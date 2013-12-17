//Helpers

function getRandomIntRange(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateColor(min, max)
{
	if(typeof min === 'undefined')
	{
		min = 0;
	}
	
	if(typeof max === 'undefined')
	{
		max = 255;
	}

	var r = Math.floor(getRandomIntRange(min, max)),
		g = Math.floor(getRandomIntRange(min, max)),
		b = Math.floor(getRandomIntRange(min, max));
		
	return [r, g, b];
}

function makeAngle(ang, rad, rad2)
{
	return { x: Math.cos(ang) * rad, y: Math.sin(ang) * rad2 }
}

function randomRange(min, max) 
{
	return Math.random() * (max - min) + min;
}

function randomVariation(center, variation) 
{
//	return center + variation * randomRange(-0.5, 0.5);
	return center + variation * randomRange(0, 0.15);
}
	
function parseOptions(obj, options)
{
	if(options && typeof options === 'object')
	{
		for (var x in options)
		{
			if(typeof options[x] === 'object' && obj[x])
			{
				parseOptions(obj[x], options[x]);
			}
			else
			{
				obj[x] = options[x];	
			}
		}
	}
}

function testCollision(col, collideables)
	{
		var collision;
		for(var i = 0; i < collideables.length; i++)
		{
			col2 = collideables[i];
			if( 
				(col.x <= col2.x + col2.width/2 && col.x >= col2.x - col2.width/2) ||
				(col.y <= col2.y + col2.height/2 && col.y >= col2.y - col2.height/2)
			)
			{
				if(col instanceof Bullet)
				{
					//Bullet collision, reduce health;
					col2.health -= col.damage;
					return true;
				}
			}
		}
	}