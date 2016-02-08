var Utils = require('./utils'),
    Sliding = require('./sliding'),
    Stepping = require('./stepping');

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
