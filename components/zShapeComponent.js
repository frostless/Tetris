(function () {
    "use strict";
  
    function ZShapeComponent(x, y) {
      this.width = 45;
      this.height = 30;
      this.done = false;
  
      (() => {
       // combination of two Rectangle componets
       this.rectangleComponent1 = new RectangleComponent(x - 15, y, 30, 15);
       this.rectangleComponent2 = new RectangleComponent(x, y + this.height / 2 , 30, 15);
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
  
    ZShapeComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
      let newSpeedX = 0;
      let newSpeedY = 0;
  
      if (this.rectangleComponent1.speedX > 0) {
        // 1: Check if crash right
        this.rectangleComponent1.checkCrashRight(boundaryRight, matrix);
        this.rectangleComponent2.checkCrashRight(boundaryRight, matrix);
        newSpeedX = Math.min(this.rectangleComponent1.speedX, this.rectangleComponent2.speedX);
      }
  
      if (this.rectangleComponent1.speedX < 0) {
        // 2: Check if crash left
        this.rectangleComponent1.checkCrashLeft(boundaryLeft, matrix);
        this.rectangleComponent2.checkCrashLeft(boundaryLeft, matrix);
        newSpeedX = Math.max(this.rectangleComponent1.speedX, this.rectangleComponent2.speedX);
      }
  
      // 3: check if crash into bottom
        this.rectangleComponent1.checkCrashBottom(boundaryLeft, boundaryRight, bottomY, matrix);
        this.rectangleComponent2.checkCrashBottom(boundaryLeft, boundaryRight, bottomY, matrix);
  
        newSpeedY = Math.min(this.rectangleComponent1.speedY, this.rectangleComponent2.speedY);
  
        this.done = this.rectangleComponent1.done || this.rectangleComponent2.done;
  
        this.rectangleComponent1.speedX = newSpeedX;
        this.rectangleComponent1.speedY = newSpeedY;
        this.rectangleComponent2.speedX = newSpeedX;
        this.rectangleComponent2.speedY = newSpeedY;
  
      // update pos
      this.rectangleComponent1.updateCoord();
      this.rectangleComponent2.updateCoord();
    };
  
    ZShapeComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
      this.rectangleComponent1.speedX = speedX;
      this.rectangleComponent1.speedY = speedY;
      this.rectangleComponent2.speedX = speedX;
      this.rectangleComponent2.speedY = speedY;
    }
  
    ZShapeComponent.prototype.changeVertSpeed = function (speedY) {
      this.rectangleComponent1.speedY = speedY;
      this.rectangleComponent2.speedY = speedY;
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