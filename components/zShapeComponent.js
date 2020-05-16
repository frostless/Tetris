(function () {
    "use strict";
  
    function ZShapeComponent(x, y, width, height, basicLength) {
      this.width = width;
      this.height = height;
      this.speedY = basicLength;
      this.basicLength = basicLength;
      this.done = false;
  
      (() => {
       // combination of two Rectangle componets
       this.rectangleComponent1 = new RectangleComponent(x - basicLength, y, basicLength * 2, basicLength, basicLength);
       this.rectangleComponent2 = new RectangleComponent(x, y + height / 2 , basicLength *  2, basicLength, basicLength);
       this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
      })();
    }
  
    ZShapeComponent.prototype.getTopLeftCoord = function () {
      let rectangle1TopleftCoord = this.rectangleComponent1.getTopLeftCoord();
      let rectangle2TopLeftcoord = this.rectangleComponent2.getTopLeftCoord();
  
      return rectangle1TopleftCoord[1] < rectangle2TopLeftcoord[1]
        ? rectangle1TopleftCoord
        : rectangle2TopLeftcoord;
    };
  
    ZShapeComponent.prototype.getTopRightCoord = function () {
      let rectangle1TopRightCoord = this.rectangleComponent1.getTopRightCoord();
      let rectangle2TopRightcoord = this.rectangleComponent2.getTopRightCoord();
  
      return rectangle1TopRightCoord[1] < rectangle2TopRightcoord[1]
        ? rectangle1TopRightCoord
        : rectangle2TopRightcoord;
    }
  
    ZShapeComponent.prototype.getBottomLeftCoord = function () {
    }
  
    ZShapeComponent.prototype.getBottomRightCoord = function () {
    };
  
    ZShapeComponent.prototype.update = function (bottomY, matrix) {
      let newSpeedY = 0;
  
        this.rectangleComponent1.checkCrashBottom(bottomY, matrix);
        this.rectangleComponent2.checkCrashBottom(bottomY, matrix);
  
        newSpeedY = Math.min(this.rectangleComponent1.speedY, this.rectangleComponent2.speedY);
  
        this.done = this.rectangleComponent1.done || this.rectangleComponent2.done;
  
        this.rectangleComponent1.speedY = newSpeedY;
        this.rectangleComponent2.speedY = newSpeedY;
  
      // update pos
      this.rectangleComponent1.updateCoord();
      this.rectangleComponent2.updateCoord();
    };
  
    ZShapeComponent.prototype.changeHorizontalSpeed = function (speedX, matrix, boundaryLeft, boundaryRight) {
      if (speedX > 0) {
        this.rectangleComponent1.checkCrashRight(speedX, boundaryRight, matrix);
        this.rectangleComponent2.checkCrashRight(speedX, boundaryRight, matrix);
        let x = Math.min(this.rectangleComponent1.speedX, this.rectangleComponent2.speedX);
        this.rectangleComponent1.updateX(x);
        this.rectangleComponent2.updateX(x);
      } else {
        this.rectangleComponent1.checkCrashLeft(speedX, boundaryLeft, matrix);
        this.rectangleComponent2.checkCrashLeft(speedX, boundaryLeft, matrix);
        let x = Math.max(this.rectangleComponent1.speedX, this.rectangleComponent2.speedX);
        this.rectangleComponent1.updateX(x);
        this.rectangleComponent2.updateX(x);
      }
    }

    ZShapeComponent.prototype.revertHorizontalSpeed = function () {
      this.rectangleComponent1.revertHorizontalSpeed();
      this.rectangleComponent2.revertHorizontalSpeed();
   }
  
    ZShapeComponent.prototype.isGameOver = function (boundaryTop) {
      return this.rectangleComponent1.isGameOver(boundaryTop) || this.rectangleComponent2.isGameOver(boundaryTop)
    }
  
    ZShapeComponent.prototype.transformToN = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
      let offset = Math.min(this.rectangleComponent1.height, this.rectangleComponent1.width) * 2;
      let bottomLeftCoord = this.rectangleComponent1.getBottomLeftCoord();
      let bottomLeftCoordY = bottomLeftCoord[1];
      // ignore if crash into canvas
      if (bottomLeftCoordY + offset >  bottomY)
        return;
  
      let transfrom2 = this.rectangleComponent2.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transfrom2){
        return;
      }
  
      // change coord first,revert later if transform fail
      this.rectangleComponent1.coordinates.forEach((item) => {
        item[1] += offset;
      });
      let transfrom1 = this.rectangleComponent1.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transfrom1){
        this.rectangleComponent1.coordinates.forEach((item) => {
          item[1] -= offset;
        });
        // revert
        this.rectangleComponent2.transform(boundaryLeft, boundaryRight, bottomY, matrix);
        return;
      }
  
      const oldWidth = this.width;
      this.width = this.height;
      this.height = oldWidth;
      this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
    }
  
    ZShapeComponent.prototype.transformToZ = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
      let transfrom2 = this.rectangleComponent2.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transfrom2){
        return;
      }
  
      let offset = Math.min(this.rectangleComponent1.height, this.rectangleComponent1.width) * 2;
      // change coord first,revert later if transform fail
      this.rectangleComponent1.coordinates.forEach((item) => {
        item[1] -= offset;
      });
      let transfrom1 = this.rectangleComponent1.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transfrom1){
        this.rectangleComponent1.coordinates.forEach((item) => {
          item[1] += offset;
        });
        // revert
        this.rectangleComponent2.transform(boundaryLeft, boundaryRight, bottomY, matrix)
        return;
      }
  
      const oldWidth = this.width;
      this.width = this.height;
      this.height = oldWidth;
      this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
    }
  
    ZShapeComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
      if(this.width > this.height)
        this.transformToN(boundaryLeft, boundaryRight, bottomY, matrix);
      else
        this.transformToZ(boundaryLeft, boundaryRight, bottomY, matrix);
    }

    window.ZShapeComponent = ZShapeComponent || {};
})();