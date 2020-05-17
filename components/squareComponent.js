(function () {
    "use strict";
  
    function SquareComponent(x, y, width, height, basicLength) {
      this.width = width;
      this.height = height;
      this.speedX = 0;
      this.speedY = basicLength;
      this.basicLength = basicLength;
      this.done = false;
  
      (() => {
        x = x - this.width / 2;
        y = y;
        let coordinates = [];
        for (let i = y; i < y + this.height; i++) {
          for (let j = x; j < x + this.width; j++) {
            let borderXLine = (i - y + 1) % this.basicLength === 0;
            let borderYLine = (j - x + 1) % this.basicLength === 0;
            if (borderXLine || borderYLine) {
              coordinates.push([j, i, 1]); // 1 means border, different color
            } else {
              coordinates.push([j, i, 0]); // 0 means no border
            }
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
  
    SquareComponent.prototype.update = function (bottomY, matrix) {
      this.checkCrashBottom(bottomY, matrix);
      // update pos
      this.updateCoord();
    };
  
    SquareComponent.prototype.checkCrashRight = function (speedX, boundaryRight, matrix) {
      let length = this.coordinates.length;
      let smallestSpeedX = speedX;
      // loop through the rightmost Coords
      for (let i = 0; i < length; i += this.width) {
        let coordX = this.coordinates[i][0] + this.width - 1; // -1 because coordinates starts from 0
        let coordY = this.coordinates[i][1];

        for (let j = 1; j <= smallestSpeedX; j++) {
          // crash into other components or canvas
          // get the smallest speedX
          if (coordX + j === boundaryRight + 1 ||
              (matrix[coordX + j][coordY] && matrix[coordX + j][coordY][0] === 1)) {
            smallestSpeedX = j - 1;
          }
        }
      }
      this.speedX = smallestSpeedX;
    };
  
    SquareComponent.prototype.checkCrashLeft = function (speedX, boundaryLeft, matrix) {
      let length = this.coordinates.length;
      let smallestSpeedX = speedX;
      // loop through the lefmost Coords
      for (let i = 0; i < length; i += this.width) {
        let coordX = this.coordinates[i][0];
        let coordY = this.coordinates[i][1];
        for (let j = -1; j >= smallestSpeedX; j--) {
          // crash into other components or canvas
          // get the smallest speedX
          if (coordX + j === boundaryLeft - 1 ||
              (matrix[coordX + j][coordY] && matrix[coordX + j][coordY][0] === 1)) {
            smallestSpeedX = j + 1;
          }
        }
      }
      this.speedX = smallestSpeedX;
    };
  
    SquareComponent.prototype.checkCrashBottom = function (bottomY, matrix) {
      let length = this.coordinates.length - 1; // -1 because coordinates starts from 0
      let smallestSpeedY = this.basicLength;
      // loop through the lowest Xs
      for (let i = length; i > length - this.width; i--) {
        let coordX = this.coordinates[i][0];
        let coordY = this.coordinates[i][1];
      
        for (let j = 1; j <= smallestSpeedY; j++) {
          // crash into other components or canvas
          // get the smallest speedy
          if (coordY + j === bottomY + 1 || 
              (matrix[coordX][coordY + j] && matrix[coordX][coordY + j][0] === 1)) {
            this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game
            smallestSpeedY = j - 1;
          }
        }
  
      }

      this.speedY = smallestSpeedY;
    };
  
    SquareComponent.prototype.updateCoord = function () {
      this.coordinates.forEach((item) => {
        item[1] += this.speedY;
      });
    };

    SquareComponent.prototype.revertHorizontalSpeed = function () {
      this.speedX = 0;
    };
  
    SquareComponent.prototype.changeHorizontalSpeed = function (speedX, matrix, boundaryLeft, boundaryRight) {
      if (speedX > 0) {
        this.checkCrashRight(speedX, boundaryRight, matrix);
        this.updateX(this.speedX);
      } else {
        this.checkCrashLeft(speedX, boundaryLeft, matrix) 
        this.updateX(this.speedX);
      }
    }

    SquareComponent.prototype.updateX = function (x) {
      this.coordinates.forEach((item) => {
        item[0] += x;
      });
    }
  
    SquareComponent.prototype.transform = function () {
      // square shap does not transform
    }
  
    SquareComponent.prototype.isGameOver = function (boundaryTop) {
      return this.coordinates[0][1] <= boundaryTop;
    }

    window.SquareComponent = SquareComponent || {};
})();