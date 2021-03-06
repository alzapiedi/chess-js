var Board = require('./board'),
    Utils = require('./utils');

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
