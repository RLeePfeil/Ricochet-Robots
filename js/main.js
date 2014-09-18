/*
 * Game: Ricochet Robots
 *
 * Golossary:
 *   Boards -
 *     Each board is set up to be the top-left quadrant of the board
 *     The boards need to be transposed / rotated when combined to make the full game board
 *   Robots -
 *     Robots come in 4 colors (5 if silver is used) and are the pieces that
 *     the player moves around the board
 *   Walls -
 *     Stop a piece from moving through. [north, south, east, west]
 *     [0, 1, 1, 0] would look like _| and a 0 means no walls.
 *     The edge pieces of the board all have walls
 *   Targets -
 *     All targets need walls - targets are a property of walls
 *     They have the shapes "star", "circle", "moon", "hexagon" and the same colors as the robots
 *     Targets only exist on floating walls w/ 2 sides (so no 1 wall from the edge), and are randomly seeded
 */

// Shorthand for wall types
var w = {t: [1,0,0,0],
		 r: [0,1,0,0],
		 b: [0,0,1,0],
		 l: [0,0,0,1],
		tr: [1,1,0,0],
		br: [0,1,1,0],
		bl: [0,0,1,1],
		tl: [1,0,0,1],
		xx: [1,1,1,1]}

var colors = ['red', 'blue', 'yellow', 'green'];
var shapes = ['star', 'moon', 'circle', 'hexagon'];

var Game = {
	$board: $('#board-container'),
	$boardGrid: $('#board'),
	$numMoves: $('#num-moves'),
	controls: {
		joystick: $('#joystick-head'),
		moveBack: $('#btn-move-back'),
		reset: $('#bth-reset'),
		colorButtons: $('.color-button'),
		red: $('.color-button-red'),
		blue: $('.color-button-blue'),
		yellow: $('.color-button-yellow'),
		green: $('.color-button-green'),
	},
	robots: {},
	robotMoving: false,
	movesList: [],
	
	options: {
		boards: [
		   [[   0,   0,   0,   0, w.l,   0,   0,   0,   0,   0,   0, w.l,   0,   0,   0,   0],
			
			[   0,   0,w.bl,   0,   0,   0,   0,   0,   0,   0,w.bl,   0,   0,   0,   0,   0],
			
			[   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
			
			[   0,   0,   0,   0,   0,   0,w.br,   0,   0,   0,   0,   0,   0,   0,   0,   0],
			
			[   0,   0,w.tr,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,w.br,   0,   0],
			
			[   0,   0,   0,   0,w.tl,   0,   0,   0,   0,w.tl,   0,   0,   0,   0,   0, w.b],
			
			[ w.b,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,w.tr,   0,   0,   0,   0],
			
			[   0,   0,   0,   0,   0,   0,   0,w.xx,w.xx,   0,   0,   0,   0,   0,   0,   0],
			
			[   0,   0,   0,   0, w.l,   0,   0,w.xx,w.xx,   0,   0,   0, w.l,   0,   0,   0],
			
			[   0,   0,w.bl,   0,   0,   0,   0,   0,   0,   0,w.bl,   0,   0,   0,   0,   0],
			
			[   0,   0,   0,   0,   0,   0,w.tr,   0,   0,   0,   0,   0,   0,   0,   0, w.t],
			
			[   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,w.tl,   0,   0],
			
			[   0,   0,w.tr,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
			
			[ w.t,   0,   0,   0,   0,   0,   0,   0,   0,   0,w.tr,   0,   0,   0,   0,   0],
			
			[   0,   0,   0,   0,   0,w.br,   0,   0,   0,   0,   0,   0,   0,w.br,   0,   0],
			
			[   0,   0,   0, w.l,   0,   0,   0, w.l,   0,   0,   0,   0,   0,   0,   0,   0]]
		],
		joystickMovement: 20 // # of px the joystick is allowed to move
	},
	init: function() {
		// Pick a board
		Game.board = Game.options.boards[0];
		
		// Create list of targets
		targets = [];
		for (var c=0; c<colors.length; c++) {
			for (var s=0; s<shapes.length; s++) {
				targets.push({color: colors[c], target: colors[c] + '-' + shapes[s]});
			}
		}
		
		// Create board html, and put walls and targets on the board
		for (y=0; y<Game.board.length; y++) {
			row = '<tr>';
			for (x=0; x<Game.board[0].length; x++) {
				// Turn zeroes into empty obj
				Game.board[y][x] = Game.board[y][x] == 0 ? [] : Game.board[y][x];
				
				isDark = '',
				isWall = '',
				isTarget = '';
				
				if (Game.board[y][x].length > 0) {
					// Find out which wall, then seed with random target
					for (key in w) {
						if (Game.board[y][x] == w[key]) {
							isWall = ' '+key;
							Game.board[y][x] = [new Wall({myX:x, myY:y, walls:w[key]})];
							break;
						}
					}
					
					if (isWall == ' tr' || isWall == ' br' || isWall == ' tl' || isWall == ' bl') {
						target = targets.splice(Math.floor(Math.random()*targets.length), 1)[0];
						isTarget = ' ' + target.target;
						Game.board[y][x].push(new Target({myX:x, myY:y, color:target.color, target:target.target}));
					}
				}
				
				// Alternate the square color
				isDark = (y*Game.board[0].length+x+4)%3 == 0 ? ' dark' : '';
				row += '<td class="square' + isDark + isWall + isTarget +'"></td>'; 
			}
			row += "</tr>"
			Game.$boardGrid.append(row);
		}
		
		// Trigger resize to establish size
		Game.onResize();
		
		// Add robots
		new Robot({color: "red"});
		new Robot({color: "blue"});
		new Robot({color: "yellow"});
		new Robot({color: "green"});
		
		// Set up controls
		Game.controls.joystick.on('touchstart', Game.joystickListenStart)
		Game.controls.colorButtons.on('mouseup', Game.colorButtonHandler)
		$('body').on('keydown', Game.keyboardListener)
		Game.controls.moveBack.on('mouseup', Game.moveBack);
		Game.controls.reset.on('mouseup', Game.moveReset);
	},
	
	currentRobot: function() {
		// Get the currently selected robot
		activeButton = $('.color-button.active');
		if (!activeButton.length) {
			return {move: function(d){ alert('no robot selected'); }};
		} else {
			return Game.robots[activeButton.data('color')];
		}
	},
	
	moveAdd: function(color, location) {
		// Update number of moves in UI and history
		Game.movesList.push({color:color, location:location});
		Game.moveNumUpdate();
	},
	
	moveBack: function(howMany) {
		howMany = howMany == undefined ? 1 : howMany;
		Game.robots[Game.movesList[Game.movesList.length-1].color].moveBack();
		Game.movesList.pop();
		Game.moveNumUpdate();
	},
	
	moveNumUpdate: function() {
		Game.$numMoves.html(Game.movesList.length);
		return Game.movesList.length;
	},
	
	moveReset: function() {
		// Undo all moves, put robots back in their starting spots
	},
	
	// Control events
	keyboardListener: function(e) {
		listenKeys = [37,38,39,40, 49,50,51,52] // Listen for left, up, right, down, and 1, 2, 3, 4
		if ($.inArray(e.keyCode, listenKeys) >= 0) {
			e.preventDefault();
			console.log('key hit: '+e.keyCode);
			
			switch (e.keyCode) {
				case 37:
					Game.currentRobot().move("W");
					break;
				case 38:
					Game.currentRobot().move("N");
					break;
				case 39:
					Game.currentRobot().move("E");
					break;
				case 40:
					Game.currentRobot().move("S");
					break;
				case 49:
					Game.controls.red.trigger("mouseup");
					break;
				case 50:
					Game.controls.blue.trigger("mouseup");
					break;
				case 51:
					Game.controls.yellow.trigger("mouseup");
					break;
				case 52:
					Game.controls.green.trigger("mouseup");
					break;
			}
		} else {
			console.log('another key pressed, don\'t intercept');
		}
	},
	
	colorButtonHandler: function(e) {
		Game.controls.colorButtons.removeClass('active');
		$(this).addClass('active');
	},
	
	joystickListenStart: function(e) {
		e.preventDefault();
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		
		Game.controls.joystick.data('touchstart', {x:touch.pageX, y:touch.pageY})
		
		$('body')
			.addClass('joystick-active')
			.on('touchmove', Game.joystickListen)
			.on('touchend', function(){
				// Reset joystick to 0
				Game.controls.joystick.css({
					transform: "translateX(0) translateY(0)"
				});
				
				// Stop listening
				$('body')
					.removeClass('joystick-active')
					.unbind('touchmove', Game.joystickListen)
			})
	},
	joystickListen: function(e) {
		// Move the joystick
		e.preventDefault();
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		
		diffX = touch.pageX - Game.controls.joystick.data('touchstart').x,
		diffY = touch.pageY - Game.controls.joystick.data('touchstart').y;
		
		// Make sure it moves no more than 20 pixels
		diffAbs = Math.abs(diffX) + Math.abs(diffY);
		if (diffAbs > Game.options.joystickMovement) {
			diffX = Math.round((Game.options.joystickMovement/diffAbs) * diffX * 10)/10;
			diffY = Math.round((Game.options.joystickMovement/diffAbs) * diffY * 10)/10;
			//Math.atan(diffY / diffX) * (180/Math.PI)// Find the tangent point on a 20r circle
		}
		
		//console.log(diffX + "px " + diffY + "px");
		
		Game.controls.joystick.css({
			transform: "translateX("+diffX+"px) translateY("+diffY+"px)"
		});
		
		// Does it trigger anything?
		if (Math.abs(diffX) > Game.options.joystickMovement*.75) {
			if (diffX < 0) {
				// Move current robot left
				Game.currentRobot().move('W');
			} else {
				// Move current robot right
				Game.currentRobot().move('E');
			}
		} else if (Math.abs(diffY) > Game.options.joystickMovement*.75) {
			if (diffY < 0) {
				// Move current robot up
				Game.currentRobot().move('N');
			} else {
				// Move current robot down
				Game.currentRobot().move('S');
			}
		}
	},
	
	// Global page events
	onResize: function(e) {
		$('.square').each(function(){
			$(this).css('height', $(this).width());
		});
	},
	
	// Utilities
	transpose: function(a) {
		// http://stackoverflow.com/questions/4492678/to-swap-rows-with-columns-of-matrix-in-javascript-or-jquery
		// Calculate the width and height of the Array
		var w = a.length ? a.length : 0,
			h = a[0] instanceof Array ? a[0].length : 0;
		
		// In case it is a zero matrix, no transpose routine needed.
		if(h === 0 || w === 0) { return []; }
		
		/**
		 * @var {Number} i Counter
		 * @var {Number} j Counter
		 * @var {Array} t Transposed data is stored in this array.
		 */
		var i, j, t = [];
		
		// Loop through every item in the outer array (height)
		for(i=0; i<h; i++) {
		
			// Insert a new row (array)
			t[i] = [];
		
			// Loop through every item per item in outer array (width)
			for(j=0; j<w; j++) {
		
			  // Save transposed data.
			  t[i][j] = a[j][i];
			}
		}
		
		return t;
	}
}

function Wall(options){
	this.type = "Wall";
	this.myX;
	this.myY;
	this.walls = [0,0,0,0];
	this.target;
	
	for (option in options) {
		this[option] = options[option];
	}
	
	this.me = this.addMe();
}

Wall.prototype.addMe = function() {
	return Game.$board.find('tr:eq('+this.myY+')').find('td:eq('+this.myX+')');
}

function Target(options){
	this.type = "Target";
	this.myX;
	this.myY;
	this.target;
	
	for (option in options) {
		this[option] = options[option];
	}
	
	this.me = this.addMe();
}

Target.prototype.addMe = function() {
	return Game.$board.find('tr:eq('+this.myY+')').find('td:eq('+this.myX+')');
}

function Robot(options){
	this.type = "Robot";
	this.myX;
	this.myY;
	this.color;
	this.movesList = [];
	
	for (option in options) {
		this[option] = options[option];
	}
	
	this.me = this.addMe();
	
	this.moveMe({x: this.myX, y: this.myY}, false); // false, do not remember this move (doesn't count)
}

Robot.prototype.addMe = function(options) {
	startPos = this.randomPosition();
	this.myX = startPos.x;
	this.myY = startPos.y;
	
	Game.robots[this.color] = this;
	
	Game.$board.prepend('<div class="robot '+this.color+'"></div>');
	
	return $('.robot').filter('.'+this.color);
}

Robot.prototype.move = function(direction) {
	// Is there a reason I can't move? Say so
	if (!Game.robotMoving) {
		moveCheckResult = this.moveCheck(direction)
		if (moveCheckResult) {
			this.moveMe(moveCheckResult);
			Game.robotMoving = true;
			setTimeout(function(){Game.robotMoving = false;}, 525); // Takes 500 ms for robot to move
		}
	}
}

Robot.prototype.moveCheck = function(direction) {
	// Find my ending location given a direction N, W, E, S
	// If I can't move in that direction, return false
	
	console.log("moveCheck: "+direction);
	
	moveObj = {
		moveY: this.myY,
		moveX: this.myX,
		currentSquare: function(){ return Game.board[moveObj.moveY][moveObj.moveX] }
	}
	
	if (direction == "N") {
		moveObj.nextSquare = function(){ try { return Game.board[moveObj.moveY-1][moveObj.moveX] } catch(e) { console.log('nextSquare broke: '+(moveObj.moveY-1)+' '+moveObj.moveX); return false; } }
		moveObj.loopFunc = function(){ console.log("loop func called"); moveObj.moveY--; };
		moveObj.loopStop = function(){ console.log("loop stop called"); return moveObj.moveY > 0 };
		moveObj.nearWall = 0;
		moveObj.farWall  = 2;
	} else if (direction == "S") {
		moveObj.nextSquare = function(){ try { return Game.board[moveObj.moveY+1][moveObj.moveX] } catch(e) { console.log('nextSquare broke: '+(moveObj.moveY+1)+' '+moveObj.moveX); return false; } }
		moveObj.loopFunc = function(){ console.log("loop func called"); moveObj.moveY++; };
		moveObj.loopStop = function(){ console.log("loop stop called"); return moveObj.moveY < Game.board.length-1 };
		moveObj.nearWall = 2;
		moveObj.farWall  = 0;
	} else if (direction == "E") {
		moveObj.nextSquare = function(){ try { return Game.board[moveObj.moveY][moveObj.moveX+1] } catch(e) { console.log('nextSquare broke: '+(moveObj.moveY)+' '+(moveObj.moveX+1)); return false; } }
		moveObj.loopFunc = function(){ console.log("loop func called"); moveObj.moveX++; };
		moveObj.loopStop = function(){ console.log("loop stop called"); return moveObj.moveX < Game.board[0].length-1 };
		moveObj.nearWall = 1;
		moveObj.farWall  = 3;
	} else if (direction == "W") {
		moveObj.nextSquare = function(){ try { return Game.board[moveObj.moveY][moveObj.moveX-1] } catch(e) { console.log('nextSquare broke: '+(moveObj.moveY)+' '+(moveObj.moveX-1)); return false; } }
		moveObj.loopFunc = function(){ console.log("loop func called"); moveObj.moveX--; };
		moveObj.loopStop = function(){ console.log("loop stop called"); return moveObj.moveX > 0 };
		moveObj.nearWall = 3;
		moveObj.farWall  = 1;
	}
	
	// Test that we're not moving into the board edge
	var LOOPKILL = 0;
	var breakHit = false;
	whileloop:
	while (moveObj.loopStop() && !breakHit) {
		// If we're on a square that has walls, test to see if one of them is moveObj.nearWall
		for (i=0; i<moveObj.currentSquare().length; i++) {
			if (moveObj.currentSquare()[i].type == "Wall") {
				console.log('currently on a wall space');
				if (moveObj.currentSquare()[i].walls[moveObj.nearWall] == 1) {
					// will hit near wall - go no further
					console.log('break hit');
					breakHit = true;
					break whileloop;
				}
			}
		}
		
		if (moveObj.nextSquare()) {
			for (i=0; i<moveObj.nextSquare().length; i++) {
				// If we're moving into a square with walls, test to see if one of them is moveObj.farWall
				if (moveObj.nextSquare()[i].type == "Wall") {
					console.log('next spot is a wall space');
					if (moveObj.nextSquare()[i].walls[moveObj.farWall] == 1) {
						// will hit far wall - go no further
						console.log('break hit');
						breakHit = true;
						break whileloop;
					}
				}
				
				// If we're moving into a square with a robot, stop the loop, we can move no further
				if (moveObj.nextSquare()[i].type == "Robot") {
					// will hit robot - go no further
					console.log('break hit');
					breakHit = true;
					break whileloop;
				}
			}
		}
		
		if (LOOPKILL > 20) {
			console.log("loop killed");
			break;
		}
		
		moveObj.loopFunc();
		console.log(moveObj.moveX+", "+moveObj.moveY);
		LOOPKILL++;
	}
	
	if (moveObj.moveY == this.myY && moveObj.moveX == this.myX) {
		return false;
	} else {
		return {x:moveObj.moveX, y:moveObj.moveY}
	}
}

Robot.prototype.moveMe = function(location, remember) {
	remember = remember == undefined ? true : false;
	// Update my move on the grid
	Game.board[this.myY][this.myX].robot = null;
	this.myX = location.x;
	this.myY = location.y;
	Game.board[this.myY][this.myX].robot = this;
	// move me to a [x, y] spot (using css transform)
	this.me.css('transform',  'translateX('+location.x+'00%) translateY('+location.y+'00%) translateZ(1px) scale(.8)'); // Scale always at the end
	// Add move to the move history
	this.movesList.push(location);
	if (remember) {
		Game.moveAdd(this.color, location);
	}
}

Robot.prototype.randomPosition = function() {
	// Find a position on the board that isn't a special square to start
	var randomX, randomY;
	do {
		randomX = Math.floor(Game.board[0].length * Math.random());
		randomY = Math.floor(Game.board.length * Math.random());
	} while(Game.board[randomY][randomX] != 0);
	
	return {x:randomX, y:randomY};
}

Robot.prototype.moveBack = function(howMany) {
	howMany = howMany == undefined ? 1 : howMany;
	// Step back to previous position
	this.movesList.pop();
	this.moveMe(this.movesList[this.movesList.length-1], false);
}