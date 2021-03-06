var Pieces = require('./pieces'),
    Utils = require('./utils');

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
