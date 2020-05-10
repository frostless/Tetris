(function () {
  "use strict";

 
  function ComponentFactory(x, y) {
    this.x = x;
    this.y = y;
  }

  ComponentFactory.prototype.initSquareComponent = function () {
    return new SquareComponent(this.x, this.y);
  }

  ComponentFactory.prototype.initRectangleComponent = function () {
    return new RectangleComponent(this.x, this.y);
  }

  ComponentFactory.prototype.initHalfCrossComponent = function () {
    return new HalfCrossComponent(this.x, this.y);
  }

  ComponentFactory.prototype.initZShapeComponent = function () {
    return new ZShapeComponent(this.x, this.y);
  }

  ComponentFactory.prototype.initReverseZShapeComponent = function () {
    return new ReverseZShapeComponent(this.x, this.y);
  }

  ComponentFactory.prototype.initLShapeComponent = function () {
    return new LShapeComponent(this.x, this.y);
  }

  ComponentFactory.prototype.initReverseLShapeComponent = function () {
    return new ReverseLShapeComponent(this.x, this.y);
  }

  window.ComponentFactory = ComponentFactory || {};
})();