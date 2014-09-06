/*
 * Game: Ricochet Robots
 *
 * Golossary:
 *   Walls -
 *     Stop a piece from moving through. [north, south, east, west]
 *     [0, 1, 1, 0] would look like _| and a 0 means no walls.
 *     The edge pieces of the board all have walls
 */

// Shorthand for wall types
var t = [1,0,0,0],
	r = [0,1,0,0],
	b = [0,0,1,0],
	l = [0,0,0,1],
	tr = [1,1,0,0],
	br = [0,1,1,0],
	bl = [0,0,1,1],
	tl = [1,0,0,1];

var Game = {
	$board: $('#board'),
	
	options: {
		boards: [
		   [[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0,bl, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0,br, 0],
			[ 0, 0,tr, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0]],
			
		   [[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0,bl, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0,br, 0, 0],
			[ 0,tl, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0]],
			
		   [[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0,bl, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0,tr, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0,tr, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, l, 0, 0]],
			
		   [[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0,bl, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0,tr, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0]]
		]
	},
	init: function() {
		for (y=0; y<16; y++) {
			row = '<tr>';
			for (x=0; x<16; x++) {
				isDark = (y*16+x+4)%3 == 0 ? ' dark' : '';
				row += '<td class="square'+isDark+'"></td>';
			}
			row += "</tr>"
			Game.$board.append(row);
		}
		
		Game.onResize();
		
		//setup([Game.boards[3], Game.boards[1], Game.boards[2], Game.boards[0]])
	},
	setup: function(boards) {
		// Assemble board
		Game.board = [];
		for (var i=0; i<boards[0].length; i++) {
			Game.board.push(boards[0][i] + boards[1][i])
		}
		for (i=0; i<boards[2].length; i++) {
			Game.board.push(boards[2][i] + boards[3][i])
		}
		
		// Put walls on the board
		for (i=0; i<boards; i++) {
			
		}
	},
	onResize: function(e) {
		$('.square').each(function(){
			$(this).css('height', $(this).width());
		});
	}
}

function Square(options){
	this.myX;
	this.myY;
	this.walls = [0,0,0,0];
	this.special;
	
	this.me = this.addMe();
}

Square.prototype.addMe = function() {
	_this = this;
	
	Game.$board.append('<div class="square"');
	
	return $('.square').filter(function(){
		$(this).data('myX') == _this.myX &&
		$(this).data('myY') == _this.myY
	});
}

function Robot(options){
	this.myX;
	this.myY;
	this.color;
	this.numMoves;
}

Robot.prototype.addMe = function(options) {
	
}

Robot.prototype.moveMe = function(direction) {
	
}