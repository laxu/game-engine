//Preload images			
var queue = new createjs.LoadQueue(true);
	queue.loadManifest([
		'images/game_bg.png',
		'images/game_bg2.png',
		'images/player.png',
		'images/enemy.png',
		'images/smoke_puff.png'
	]);

//Start game loop
queue.addEventListener('complete', startGame);

function startGame() {	
	
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(framerate);
	
	level = new Level('images/game_bg2.png');
	bgLimits = new createjs.Point(level.bgGraphic.width - cw, level.bgGraphic.height - ch);

	var test = new createjs.Bitmap('images/enemy.png');
	test.x = 150;
	test.y = 250;

	level.add(test);

	player = new Player(); 

	camera = new Camera({ followed: player.skin });
	level.update();
	
	
//	var vihu = new Enemy({ initPos: [ 400, 200] });	

	createjs.Ticker.addEventListener('tick', gameLoop);
}

//Game loop
function gameLoop()
{	
	if(!paused)
	{
		var i = 0;
		for(i; i < actors.length; i++) 
		{
			actors[i].update();
		}

		for(i = 0; i < bullets.length; i++)
		{
			bullets[i].update(i);
		}

		for(i = 0; i < items.length; i++)
		{	
			items[i].update(i);
		}

		camera.update();

		level.update();
	}
}

var paused = false;

$(document).ready(function() {
	$('#pause_button').on('click', function() {
		paused = !createjs.Ticker.getPaused();
		createjs.Ticker.setPaused(paused);
	});
});
