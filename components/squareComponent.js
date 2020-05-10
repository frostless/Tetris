(function () {
    "use strict";
  
    function SquareComponent(x, y, width, height) {
      this.width = width || 30;
      this.height = height || 30;
      this.speedX = 0;
      this.speedY = 5;
      // this.color = color;
      this.done = false;
  
      (() => {
        x = x - this.width / 2;
        y = y;
        let coordinates = [];
        for (let i = y; i < y + this.height; i++) {
          for (let j = x; j < x + this.width; j++) {
            coordinates.push([j, i]);
          }
        }
        this.coordinates = coordinates;
      })();
    }
  
    SquareComponent.prototype.getTopLeftCoord = function () {
      return this.coordinates[0];
    }
  
    SquareComponent.prototype.getTopRightCoord = function () {
      let step = this.width;
      return this.coordinates[step - 1];
    }
  
    SquareComponent.prototype.getBottomLeftCoord = function () {
      let step = this.width;
      let length = this.coordinates.length;
      return this.coordinates[length - step];
    }
  
    SquareComponent.prototype.getBottomRightCoord = function () {
      let length = this.coordinates.length;
      return this.coordinates[length - 1];
    }
  
    SquareComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
      // here we calculate if the next update would crash into canvas's left, right, bottom,
      // and other components' left, right and bottom
      // an offset will be made to the speed diredction to avoid potential crashes
      // if the calculation is done at one direction at a time then a bug might occur:
      // if the movement will not crash into a component horiontolly when calculating speedX
      // and not vertically when calculatting speedY, offset will not occur, but when speedX and SpeedY 
      // are taken into consideration together, crash may happen, when offset happen at a later time,
      // the crashing component will be erased and this will also partilly earse the componeng being crashed
      // solutions: 
      // 1: refill the whole canvas every update -- too inefficient
      // 2: take speedX and speedY together into consideration -- good
      // 3: when speedX != 0 make speedY = 0 -- ok and easy to implement
      // use #2 for now, as it refelcts the original game better
      if (this.speedX > 0) {
        // 1: Check if crash right
        this.checkCrashRight(boundaryRight, matrix);
      }
  
      if (this.speedX < 0) {
        // 2: Check if crash left
        this.checkCrashLeft(boundaryLeft, matrix);
      }
  
      // 3: check if crash into bottom
      this.checkCrashBottom(boundaryLeft, boundaryRight, bottomY, matrix);
  
      // update pos
      this.updateCoord();
    };
  
    SquareComponent.prototype.checkCrashRight = function (boundaryRight, matrix) {
      let length = this.coordinates.length;
      let smallestSpeedX = this.speedX;
      // loop through the rightmost Coords
      for (let i = 0; i < length; i += this.width) {
        let coordX = this.coordinates[i][0] + this.width - 1; // -1 because coordinates starts from 0
        let coordY = this.coordinates[i][1];
  
        for (let j = 1; j <= smallestSpeedX; j++) {
          // crash into other components or canvas
          // get the smallest speedX
          if (coordX + j === boundaryRight + 1 || matrix[coordX + j][coordY] === 1) {
              smallestSpeedX = j - 1;
          }
        }
  
      }
      this.speedX = smallestSpeedX;
    };
  
    SquareComponent.prototype.checkCrashLeft = function (boundaryLeft, matrix) {
      let length = this.coordinates.length;
      let smallestSpeedX = this.speedX;
      // loop through the lefmost Coords
      for (let i = 0; i < length; i += this.width) {
        let coordX = this.coordinates[i][0];
        let coordY = this.coordinates[i][1];
        for (let j = -1; j >= smallestSpeedX; j--) {
          // crash into other components or canvas
          // get the smallest speedX
          if (coordX + j === boundaryLeft - 1 || matrix[coordX + j][coordY] === 1) {
              smallestSpeedX = j + 1;
          }
        }
  
      }
      this.speedX = smallestSpeedX;
    };
  
    SquareComponent.prototype.checkCrashBottom = function (boundaryLeft, boundaryRight, bottomY, matrix) {
      let length = this.coordinates.length - 1; // -1 because coordinates starts from 0
      let smallestSpeedY = this.speedY;
      // loop through the lowest Xs
      for (let i = length; i > length - this.width; i--) {
        let coordX = this.coordinates[i][0];
        let coordY = this.coordinates[i][1];
  
        // take speedX into consideration, solution to bug mentioned earlier
        // ignore if the potential movent crash into componengt
        if (
          coordX + this.speedX >= boundaryLeft &&
          coordX + this.speedX <= boundaryRight
        ) {
          coordX += this.speedX;
        }
      
        for (let j = 1; j <= smallestSpeedY; j++) {
          // crash into other components or canvas
          // get the smallest speedy
          if (coordY + j === bottomY + 1 || matrix[coordX][coordY + j] === 1) {
            this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game
            smallestSpeedY = j - 1;
          }
        }
  
      }
      this.speedY = smallestSpeedY;
    };
  
    SquareComponent.prototype.updateCoord = function () {
      this.coordinates.forEach((item) => {
        item[0] += this.speedX;
        item[1] += this.speedY;
      });
    };
  
    SquareComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
      this.speedX = speedX;
      this.speedY = speedY;
    }
  
    SquareComponent.prototype.changeVertSpeed = function (speedY) {
      this.speedY = speedY;
    }
  
    SquareComponent.prototype.transform = function () {
      // square shap does not transform
    }
  
    SquareComponent.prototype.isGameOver = function (boundaryTop) {
      return this.coordinates[0][1] <= boundaryTop;
    }

    window.SquareComponent = SquareComponent || {};
})();