/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Display = __webpack_require__(1);
	
	var Game = function () {
	  var $el = $('#game');
	  this.display = new Display($el);
	  this.turn = "white";
	  this.display.setupGrid();
	  this.display.render();
	  this.board = this.display.board;
	  // this.display.selectStartPos();
	}
	
	Game.prototype.chooseMove = function () {
	  this.display.selectPos(this.setStart.bind(this));
	}
	
	Game.prototype.validStart = function (pos) {
	  var board = this.board;
	  return (board.isOccupied(pos) && board.piece(pos).color == this.turn);
	}
	
	Game.prototype.setStart = function (pos) {
	  if (this.validStart(pos)) {
	    this.startPos = pos;
	    this.display.select(pos);
	    var piece = this.board.piece(pos);
	    piece.moves().forEach(function (move) {
	      if (!piece.moveIntoCheck(move)) {
	        this.display.select(move);
	      }
	    }.bind(this));
	    this.chooseEnd();
	  } else if (!this.board.isOccupied(pos)) {
	    this.chooseMove();
	    this.display.flashError("No piece there");
	  } else {
	    this.chooseMove();
	    this.display.flashError("Wrong color piece");
	  }
	}
	
	Game.prototype.switchTurns = function () {
	  this.turn = this.turn === "white" ? "black" : "white";
	  if (this.board.checkmate(this.turn)) {
	    this.gameOver();
	  } else {
	    var info = this.turn === "white" ? "White's turn" : "Black's turn";
	    if (this.board.inCheck(this.turn)) {
	      info += " (CHECK)";
	    }
	    this.display.info(info);
	  }
	}
	
	Game.prototype.gameOver = function () {
	  var winner = this.turn === "white" ? "Black" : "White";
	  this.display.clearListener();
	  this.display.info("Checkmate. " + winner + " wins!");
	}
	
	Game.prototype.chooseEnd = function () {
	  this.display.selectPos(this.setEnd.bind(this));
	}
	
	Game.prototype.setEnd = function (pos) {
	  var board = this.board;
	  var piece = board.piece(this.startPos);
	  if (piece.validMove(pos)) {
	    this.display.unselect();
	    board.move(this.startPos, pos);
	    this.switchTurns();
	    this.display.render();
	    this.chooseMove();
	  } else if (!this.board.inCheck(piece.color) && piece.moveIntoCheck(pos)) {
	    this.display.flashError("Cannot move into check");
	    this.display.unselect();
	    this.chooseMove();
	  } else if (this.board.inCheck(piece.color) && piece.moveIntoCheck(pos)) {
	    this.display.flashError("You are in check");
	    this.display.unselect();
	    this.chooseMove();
	  } else {
	    this.display.flashError("Illegal move");
	    this.display.unselect();
	    this.chooseMove();
	  }
	}
	
	
	
	document.addEventListener('DOMContentLoaded', function () {
	  var g = new Game();
	  g.chooseMove();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2),
	    Utils = __webpack_require__(4);
	
	var Display = function ($el) {
	  this.$el = $el;
	  this.board = new Board();
	  window.board = this.board; ///////////  WINDOW
	  this.board.populate();
	  this.info("White's turn");
	}
	
	Display.prototype.setupGrid = function () {
	  this.$el.append("<ul>");
	  var $ul = $("<ul>").addClass("chess-grid group");
	  var color = "black";
	  for (var i = 0; i < 64; i++) {
	    var pos = [parseInt(i / 8), i % 8];
	    if (i % 8 === 0) { color = color === "white" ? "black" : "white"; }
	    $("<li>").addClass("square "+color).data("pos", pos).appendTo($ul);
	    color = color === "white" ? "black" : "white";
	  }
	  this.$el.html($ul);
	}
	
	Display.prototype.select = function (pos) {
	  $('li').each(function (i, el) {
	    if (Utils.arrayEquals($(el).data("pos"), pos)) {
	      $(el).addClass("selected");
	    }
	  });
	}
	
	Display.prototype.unselect = function () {
	  $('li').each(function (i, el) {
	    $(el).removeClass("selected");
	  });
	}
	
	Display.prototype.render = function () {
	  var pos, square;
	  var pieces = this.board.pieces();
	  $('li').each(function (i, el) {
	    square = $(el).attr("class").split(" ").slice(0,2).join(" ");
	    $(el).removeClass();
	    $(el).addClass(square);
	    pieces.forEach(function (piece) {
	      if (Utils.arrayEquals($(el).data("pos"), piece.pos)) {
	        $(el).addClass(piece.toString() + "-" + piece.color).addClass("piece");
	      }
	    })
	  });
	}
	
	Display.prototype.selectPos = function (callback) {
	  this.selectListener = $('.chess-grid').on('click', function (e) {
	    $('#errors').html("");
	    this.selectListener.off('click');
	    callback($(e.target).data("pos"));
	  }.bind(this))
	
	}
	
	Display.prototype.clearListener = function () {
	  this.selectListener && this.selectListener.off('click');
	}
	
	Display.prototype.flashError = function (error) {
	  $div = $(document.getElementById('errors'));
	  $div.html(error);
	  setTimeout(function() {
	    $div.html("");
	  }, 1500);
	}
	
	Display.prototype.info = function (info) {
	  $div = $(document.getElementById('info'));
	  $div.html(info);
	}
	
	module.exports = Display;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Pieces = __webpack_require__(3),
	    Utils = __webpack_require__(4);
	
	var Board = function () {
	  this.grid = [];
	  for (var i = 0; i < 8; i++) {
	    this.grid.push([null,null,null,null,null,null,null,null]);
	  }
	}
	
	Board.prototype.checkmate = function (color) {
	  var pieces = this.pieces(color);
	  var moves;
	  for (var i = 0; i < pieces.length; i++) {
	    moves = pieces[i].moves();
	    for (var j = 0; j < moves.length; j++) {
	      if (!pieces[i].moveIntoCheck(moves[j])) {
	        return false;
	      }
	    }
	  }
	  return true;
	}
	
	Board.prototype.setPiece = function (piece) {
	  var pos = piece.pos;
	  this.grid[pos[0]][pos[1]] = piece;
	}
	
	Board.prototype.isOccupied = function (pos) {
	  return !(this.grid[pos[0]][pos[1]] === null);
	}
	
	Board.prototype.pieces = function (color) {
	  var pieces = [];
	  for (var i = 0; i < 8; i++) {
	    for (var j = 0; j < 8; j++) {
	      if ((this.grid[i][j] && !color) || (this.grid[i][j] && color === this.grid[i][j].color)) {
	        pieces.push(this.grid[i][j]);
	      }
	    }
	  }
	  return pieces;
	}
	
	Board.prototype.piece = function (pos) {
	  return this.grid[pos[0]][pos[1]];
	}
	
	Board.prototype.findKing = function (color) {
	  var pos;
	  this.pieces(color).forEach(function (piece) {
	    if (piece.toString() === "king") {
	      pos = piece.pos;
	    }
	  });
	  return pos;
	}
	
	Board.prototype.inCheck = function (color) {
	  var otherColor = color === "white" ? "black" : "white";
	  var moves;
	  var pieces = this.pieces(otherColor);
	  var kingPos = this.findKing(color);
	  for (var i = 0; i < pieces.length; i++) {
	    moves = pieces[i].moves();
	    for (var j = 0; j < moves.length; j++) {
	      if (Utils.arrayEquals(moves[j], kingPos)) {
	        return true;
	      }
	    }
	  }
	  return false;
	}
	
	Board.prototype.move = function (startPos, endPos) {
	  var piece = this.piece(startPos);
	  piece.setPos(endPos);
	  this.grid[endPos[0]][endPos[1]] = piece;
	  this.grid[startPos[0]][startPos[1]] = null;
	}
	
	Board.prototype.inBounds = function (pos) {
	  return pos[0] >= 0 && pos[1] >= 0 && pos[0] < 8 && pos[1] < 8;
	}
	
	Board.prototype.clone = function () {
	  var pieces = board.pieces().map(function (piece) {
	    return piece.getAttr();
	  });
	  var clonedBoard = new Board();
	  pieces.forEach(function (pieceObj) {
	    if (pieceObj.type === "pawn") {
	      new Pieces.Pawn({color: pieceObj.color, pos: pieceObj.pos, board: clonedBoard});
	    } else if (pieceObj.type === "bishop") {
	      new Pieces.Bishop({color: pieceObj.color, pos: pieceObj.pos, board: clonedBoard});
	    } else if (pieceObj.type === "rook") {
	      new Pieces.Rook({color: pieceObj.color, pos: pieceObj.pos, board: clonedBoard});
	    } else if (pieceObj.type === "knight") {
	      new Pieces.Knight({color: pieceObj.color, pos: pieceObj.pos, board: clonedBoard});
	    } else if (pieceObj.type === "queen") {
	      new Pieces.Queen({color: pieceObj.color, pos: pieceObj.pos, board: clonedBoard});
	    } else if (pieceObj.type === "king") {
	      new Pieces.King({color: pieceObj.color, pos: pieceObj.pos, board: clonedBoard});
	    }
	  });
	  return clonedBoard;
	}
	
	Board.prototype.populate = function () {
	  new Pieces.Pawn({color: "black", board: this, pos: [1,0]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,1]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,2]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,3]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,4]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,5]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,6]});
	  new Pieces.Pawn({color: "black", board: this, pos: [1,7]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,0]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,1]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,2]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,3]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,4]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,5]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,6]});
	  new Pieces.Pawn({color: "white", board: this, pos: [6,7]});
	  new Pieces.Bishop({color: "white", board: this, pos: [7,2]});
	  new Pieces.Bishop({color: "white", board: this, pos: [7,5]});
	  new Pieces.Bishop({color: "black", board: this, pos: [0,2]});
	  new Pieces.Bishop({color: "black", board: this, pos: [0,5]});
	  new Pieces.Knight({color: "white", board: this, pos: [7,1]});
	  new Pieces.Knight({color: "white", board: this, pos: [7,6]});
	  new Pieces.Knight({color: "black", board: this, pos: [0,1]});
	  new Pieces.Knight({color: "black", board: this, pos: [0,6]});
	  new Pieces.Rook({color: "white", board: this, pos: [7,0]});
	  new Pieces.Rook({color: "white", board: this, pos: [7,7]});
	  new Pieces.Rook({color: "black", board: this, pos: [0,7]});
	  new Pieces.Rook({color: "black", board: this, pos: [0,0]});
	  new Pieces.Queen({color: "white", board: this, pos: [7,3]});
	  new Pieces.Queen({color: "black", board: this, pos: [0,3]});
	  new Pieces.King({color: "black", board: this, pos: [0,4]});
	  new Pieces.King({color: "white", board: this, pos: [7,4]});
	}
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(4),
	    Sliding = __webpack_require__(5),
	    Stepping = __webpack_require__(6);
	
	var Piece = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.enemy_color = this.color === "white" ? "black" : "white";
	}
	
	Piece.CARDINALS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	Piece.DIAGONALS = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
	
	Piece.prototype.setPos = function (pos) {
	  this.pos = pos;
	}
	
	Piece.prototype.getAttr = function () {
	  return {color: this.color, pos: this.pos, type: this.toString()};
	}
	
	Piece.prototype.validMove = function (pos) {
	  var moves = this.moves();
	  // debugger;
	  for (var i = 0; i < moves.length; i++) {
	    if (Utils.arrayEquals(moves[i], pos) && !this.moveIntoCheck(pos)) {
	      return true;
	    }
	  }
	  return false;
	}
	Piece.prototype.moveIntoCheck = function (endPos) {
	  var color = this.color;
	  var testBoard = this.board.clone();
	  testBoard.move(this.pos, endPos);
	  return testBoard.inCheck(color);
	}
	
	var Pawn = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.moves = Stepping.moves.bind(this);
	  this.board.setPiece(this);
	}
	
	Utils.inherits(Pawn, Piece);
	Pawn.prototype.getMoveDirs = function () {
	  var deltas = [];
	  var startingRank = this.color === "white" ? 6 : 1;
	  var direction = this.color === "white" ? -1 : 1;
	  var oneStepForward = [this.pos[0] + direction, this.pos[1]];
	  if (!this.board.isOccupied(oneStepForward)) {
	    deltas.push([direction, 0]);
	    if (this.pos[0] === startingRank && !this.board.isOccupied([this.pos[0] + direction*2, this.pos[1]])) {
	      deltas.push([direction * 2, 0]);
	    }
	  }
	  var left = [this.pos[0] + direction, this.pos[1] - 1];
	  var right = [this.pos[0] + direction, this.pos[1] + 1];
	  var b = this.board;
	  if (b.inBounds(left) && b.isOccupied(left) && b.piece(left).color !== this.color) {
	    deltas.push([direction, -1]);
	  }
	  if (b.inBounds(right) && b.isOccupied(right) && b.piece(right).color !== this.color) {
	    deltas.push([direction, 1]);
	  }
	  return deltas;
	
	}
	Pawn.prototype.toString = function () {
	  return "pawn";
	}
	
	var Bishop = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.moves = Sliding.moves.bind(this);
	  this.board.setPiece(this);
	}
	Utils.inherits(Bishop, Piece);
	Bishop.prototype.getMoveDirs = function () {
	  return Piece.DIAGONALS;
	}
	Bishop.prototype.toString = function () {
	  return "bishop";
	}
	
	var Knight = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.moves = Stepping.moves.bind(this);
	  this.board.setPiece(this);
	}
	Utils.inherits(Knight, Piece);
	Knight.prototype.getMoveDirs = function () {
	  return [[2,1], [-2,1], [-2,-1], [2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];
	}
	
	Knight.prototype.toString = function () {
	  return "knight";
	}
	
	var Rook = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.moves = Sliding.moves.bind(this);
	  this.board.setPiece(this);
	}
	Utils.inherits(Rook, Piece);
	Rook.prototype.getMoveDirs = function () {
	  return Piece.CARDINALS;
	}
	
	Rook.prototype.toString = function () {
	  return "rook";
	}
	
	var Queen = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.moves = Sliding.moves.bind(this);
	  this.board.setPiece(this);
	}
	Utils.inherits(Queen, Piece);
	Queen.prototype.getMoveDirs = function () {
	  return Piece.CARDINALS.concat(Piece.DIAGONALS);
	}
	Queen.prototype.toString = function () {
	  return "queen";
	}
	
	var King = function (attrs) {
	  this.color = attrs.color;
	  this.board = attrs.board;
	  this.pos = attrs.pos;
	  this.moves = Stepping.moves.bind(this);
	  this.board.setPiece(this);
	}
	Utils.inherits(King, Piece);
	King.prototype.getMoveDirs = function () {
	  return Piece.CARDINALS.concat(Piece.DIAGONALS);
	}
	King.prototype.toString = function () {
	return "king";
	}
	
	module.exports = {
	  Piece: Piece,
	  Pawn: Pawn,
	  Bishop: Bishop,
	  Knight: Knight,
	  Rook: Rook,
	  Queen: Queen,
	  King: King
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Utils = {};
	
	Utils.inherits = function (subclass, parentClass) {
	  var Surrogate = function () {};
	  Surrogate.prototype = parentClass.prototype;
	  subclass.prototype = new Surrogate();
	  subclass.prototype.constructor = subclass;
	}
	
	Utils.arrayEquals = function (arr1, arr2) {
	  if (!arr1 || !arr2) {
	    return false;
	  }
	  return arr1[0] === arr2[0] && arr1[1] === arr2[1];
	}
	
	
	module.exports = Utils;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	module.exports = {
	  moves: function () {
	    var moves = [];
	    var move;
	    var board = this.board;
	    var dirs = this.getMoveDirs();
	    for (var i = 0; i < dirs.length; i++) {
	      for (var d = 1; d < 8; d++) {
	        move = [this.pos[0] + (dirs[i][0] * d), this.pos[1] + (dirs[i][1] * d)];
	        if (!this.board.inBounds(move)) {
	          break;
	        } else if (this.board.inBounds(move) && !this.board.isOccupied(move)) {
	          moves.push(move);
	        } else if (this.board.isOccupied(move) && this.board.piece(move).color !== this.color) {
	          moves.push(move);
	          break;
	        } else {
	          break;
	        }
	      }
	    }
	    return moves;
	  }
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	  moves: function () {
	    var moves = [];
	    var board = this.board
	    var dirs = this.getMoveDirs();
	    for (var i = 0; i < dirs.length; i++) {
	      var move = [this.pos[0] + dirs[i][0], this.pos[1] + dirs[i][1]];
	      if (!board.inBounds(move)) {
	        continue;
	      } else if (board.isOccupied(move) && board.piece(move).color !== this.color) {
	        moves.push(move);
	      } else if (!board.isOccupied(move)) {
	        moves.push(move)
	      }
	    }
	    return moves;
	  }
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map