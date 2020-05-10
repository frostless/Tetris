(function () {
  "use strict";

  function Drawer(width, height, statusAreaWidth) {
    this.statusAreaWidth = statusAreaWidth; // display score and others
    this.width = width + this.statusAreaWidth;
    this.height = height;
    this.color = '#000000';

    (() => {
      let canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
    })();
  }

  Drawer.prototype.initCanvas = function () {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  };

  Drawer.prototype.clearRect = function (x, y, w, h) {
    this.context.clearRect(x, y, w, h);
  };

  Drawer.prototype.fillRect = function (x, y, w, h, color) {
    color = color || this.color;
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
    this.context.fillStyle = this.color;
  };

  Drawer.prototype.fillText = function (text, x, y , maxWidth) {
    this.context.fillText(text, x, y , maxWidth);
  };

  window.Drawer = Drawer || {};
})();
