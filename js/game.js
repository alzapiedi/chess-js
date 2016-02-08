var Display = require('./display');

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
    if (piece.toString() === "king") {
      piece.moves().forEach(function (move) {
        if (!piece.moveThroughCheck(move)) {
          this.display.select(move);
        }
      }.bind(this));
    } else {
      piece.moves().forEach(function (move) {
        if (!piece.moveIntoCheck(move)) {
          this.display.select(move);
        }
      }.bind(this));
    }
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
  window.g = g;
  g.chooseMove();
});
