(function () {
  "use strict";

  function Drawer(width, height) {
    this.width = width;
    this.height = height;

    (() => {
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
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

  Drawer.prototype.fillRect = function (x, y, w, h) {
    this.context.fillRect(x, y, w, h);
  };

  Drawer.prototype.fillText = function (text, x, y , maxWidth) {
    this.context.fillText(text, x, y , maxWidth);
  };

  window.Drawer = Drawer || {};
})();
