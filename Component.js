(function () {
  "use strict";

  function SquareComponent(x, y) {
    this.width = 30;
    this.height = 30;
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
    this.coordinates.forEach((item) => {
      item[0] += this.speedX;
      item[1] += this.speedY;
    });
  };

  SquareComponent.prototype.checkCrashRight = function (boundaryRight, matrix) {
    let length = this.coordinates.length;
    let smallestSpeedX = this.speedX;
    // loop through the rightmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0] + this.width - 1; // -1 because coordinates starts from 0
      let coordY = this.coordinates[i][1];

      for (let j = 1; j <= smallestSpeedX; j++) {
        // crash into other components or canvas
        // get the smallest speedX
        if (coordX + j === boundaryRight + 1 || matrix[coordX + j][coordY] === 1) {
          if (j <= smallestSpeedX) {
            smallestSpeedX = j - 1;
          }
        }
      }

    }
    this.speedX = smallestSpeedX;
  };

  SquareComponent.prototype.checkCrashLeft = function (boundaryLeft, matrix) {
    let length = this.coordinates.length;
    let smallestSpeedX = this.speedX;
    // loop through the lefmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0];
      let coordY = this.coordinates[i][1];
      for (let j = -1; j >= smallestSpeedX; j--) {
        // crash into other components or canvas
        // get the smallest speedX
        if (coordX + j === boundaryLeft - 1 || matrix[coordX + j][coordY] === 1) {
          if (j >= smallestSpeedX) {
            smallestSpeedX = j + 1;
          }
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
        if (coordY + j === bottomY  + 1 || matrix[coordX][coordY + j] === 1) {
          this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game
          if (j <= smallestSpeedY) {
            smallestSpeedY = j - 1;
          }
        }
      }

    }
    this.speedY = smallestSpeedY;
  };

  SquareComponent.prototype.transform = function () {
    // square shap does not transform
  }


  function RetangleComponent(x, y) {
    this.width = 60;
    this.height = 15;
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

  RetangleComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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
    this.coordinates.forEach((item) => {
      item[0] += this.speedX;
      item[1] += this.speedY;
    });
  };

  RetangleComponent.prototype.checkCrashRight = function (boundaryRight, matrix) {
    let length = this.coordinates.length;
    let smallestSpeedX = this.speedX;
    // loop through the rightmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0] + this.width - 1; // -1 because coordinates starts from 0
      let coordY = this.coordinates[i][1];

      for (let j = 1; j <= smallestSpeedX; j++) {
        // crash into other components or canvas
        // get the smallest speedX
        if (coordX + j === boundaryRight + 1 || matrix[coordX + j][coordY] === 1) {
          if (j <= smallestSpeedX) {
            smallestSpeedX = j - 1;
          }
        }
      }

    }
    this.speedX = smallestSpeedX;
  };

  RetangleComponent.prototype.checkCrashLeft = function (boundaryLeft, matrix) {
    let length = this.coordinates.length;
    let smallestSpeedX = this.speedX;
    // loop through the lefmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0];
      let coordY = this.coordinates[i][1];
      for (let j = -1; j >= smallestSpeedX; j--) {
        // crash into other components or canvas
        // get the smallest speedX
        if (coordX + j === boundaryLeft - 1 || matrix[coordX + j][coordY] === 1) {
          if (j >= smallestSpeedX) {
            smallestSpeedX = j + 1;
          }
        }
      }

    }
    this.speedX = smallestSpeedX;
  };

  RetangleComponent.prototype.checkCrashBottom = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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
        if (coordY + j === bottomY  + 1 || matrix[coordX][coordY + j] === 1) {
          this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game
          if (j <= smallestSpeedY) {
            smallestSpeedY = j - 1;
          }
        }
      }

    }
    this.speedY = smallestSpeedY;
  };

  RetangleComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let newWidth = this.height;
    let newHeight = this.width;
    let leftBottom = this.coordinates[this.coordinates.length - this.width];
    let newTopLeftX = leftBottom[0];

    if (this.width > this.height) {
      let newCoordinates = [];    
      let newTopLeftY = leftBottom[1] - newHeight + 1; // +1 because coord starts from 0

      for (let i = newTopLeftY; i < newTopLeftY + newHeight; i++) {
        for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
          newCoordinates.push([j, i]);
        }
      }
      this.coordinates = newCoordinates;
      this.width = newWidth;
      this.height = newHeight;
    } else {
      let newCoordinates = [];
      let oldTopLeftY = this.coordinates[0][1];
      let newTopLeftY = leftBottom[1] - newHeight + 1; // +1 because coord starts from 0

      // ignore if crash into canvas
      if (newTopLeftX + newWidth - 1 >= boundaryRight) // -1 because width starts from 1
        return;

      // this loop #1 check if crashing other components
      // also #2 generate new coordinates
      // doing together for efficent purpose
      for (let i = oldTopLeftY; i < oldTopLeftY + this.height; i++) {
        for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
          // ignore if crash into other components
          if(matrix[j][i] === 1)
            return;    
        
          if (i >= newTopLeftY) 
            newCoordinates.push([j, i]);
        }
      }
      this.coordinates = newCoordinates;
      this.width = newWidth;
      this.height = newHeight;
    }
  };

  function Component(x, y) {
    const getRandomInt = function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const int = getRandomInt(0, 1);
    if (int === 0) {
      return new SquareComponent(x, y);
    } else {
      return new RetangleComponent(x, y);
    }

    // return new RetangleComponent(x, y);
  }

  window.Component = Component || {};
})();