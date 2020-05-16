(function () {
  "use strict";
 
  function ComponentFactory(basicLength) {
    this.basicLength = basicLength;
  }
  
  ComponentFactory.prototype.initComponent = function (componentNo ,x, y, speedY) {
    switch (componentNo) {
      case 0:
        return this.initSquareComponent(x, y, speedY);
      case 1:
        return this.initRectangleComponent(x, y, speedY);
      case 2:
        return this.initHalfCrossComponent(x, y, speedY);
      case 3:
        return this.initZShapeComponent(x, y, speedY);
      case 4:
        return this.initReverseZShapeComponent(x, y , speedY);
      case 5:
        return this.initLShapeComponent(x, y, speedY);
      case 6:
        return this.initReverseLShapeComponent(x, y, speedY);
      default:
        return this.initSquareComponent(x, y, speedY);
    }
  }

  ComponentFactory.prototype.initComponentDrawing = function (componentNo ,x, y, speedY) {
    let component = this.initComponent(componentNo ,x, y, speedY)
    let offset = this.basicLength / 2;
    switch (componentNo) {
      case 2:
        component.coordinates.forEach((item) => {
          item[0] += offset;
        });
        break;
      case 3:
        component.coordinates.forEach((item) => {
          item[0] += offset;
        });
        break;
      case 4:
        component.coordinates.forEach((item) => {
          item[0] -= offset;
        });
        break;
      case 5:
        component.coordinates.forEach((item) => {
          item[0] -= offset;
        });
        break;
      case 6:
        component.coordinates.forEach((item) => {
          item[0] -= offset;
        });
        break;
    }
    return component;
  }

  ComponentFactory.prototype.initSquareComponent = function (x, y, speedY) {
    const width = this.basicLength * 2;
    const height = this.basicLength * 2;
    return new SquareComponent(x, y, width, height, speedY, this.basicLength);
  }

  ComponentFactory.prototype.initRectangleComponent = function (x, y, speedY) {
    const width = this.basicLength * 4;
    const height = this.basicLength;
    return new RectangleComponent(x, y, width, height, speedY, this.basicLength);
  }

  ComponentFactory.prototype.initHalfCrossComponent = function (x, y, speedY) {
    const width = this.basicLength * 3;
    const height = this.basicLength * 2;
    return new HalfCrossComponent(x, y, width, height, speedY, this.basicLength);
  }

  ComponentFactory.prototype.initZShapeComponent = function (x, y, speedY) {
    const width = this.basicLength * 3;
    const height = this.basicLength * 2;
    return new ZShapeComponent(x, y, width, height, speedY, this.basicLength);
  }

  ComponentFactory.prototype.initReverseZShapeComponent = function (x, y, speedY) {
    const width = this.basicLength * 3;
    const height = this.basicLength * 2;
    return new ReverseZShapeComponent(x, y, width, height, speedY, this.basicLength);
  }

  ComponentFactory.prototype.initLShapeComponent = function (x, y, speedY) {
    const width = this.basicLength * 3;
    const height = this.basicLength * 2;
    return new LShapeComponent(x, y, width, height, speedY, this.basicLength);
  }

  ComponentFactory.prototype.initReverseLShapeComponent = function (x, y, speedY) {
    const width = this.basicLength * 3;
    const height = this.basicLength * 2;
    return new ReverseLShapeComponent(x, y, width, height, speedY, this.basicLength);
  }

  window.ComponentFactory = ComponentFactory || {};
})();