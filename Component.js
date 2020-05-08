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


  function RectangleComponent(x, y, width, height) {
    this.width = width || 60 ;
    this.height = height || 15;
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

  RectangleComponent.prototype.getTopLeftCoord = function () {
    return this.coordinates[0];
  }

  RectangleComponent.prototype.getTopRightCoord = function () {
    let step = this.width;
    return this.coordinates[step - 1];
  }

  RectangleComponent.prototype.getBottomLeftCoord = function () {
    let step = this.width;
    let length = this.coordinates.length;
    return this.coordinates[length - step];
  }

  RectangleComponent.prototype.getBottomRightCoord = function () {
    let length = this.coordinates.length;
    return this.coordinates[length - 1];
  }

  RectangleComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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

  RectangleComponent.prototype.checkCrashRight = function (boundaryRight, matrix) {
    let length = this.coordinates.length;
    let smallestSpeedX = this.speedX;
    // loop through the rightmost coord
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

  RectangleComponent.prototype.checkCrashLeft = function (boundaryLeft, matrix) {
    let length = this.coordinates.length;
    let smallestSpeedX = this.speedX;
    // loop through the lefmost coord
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

  RectangleComponent.prototype.checkCrashBottom = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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

  RectangleComponent.prototype.updateCoord = function () {
    this.coordinates.forEach((item) => {
      item[0] += this.speedX;
      item[1] += this.speedY;
    });
  };

  RectangleComponent.prototype.transformToVertical = function (matrix, forceTransform) {
    forceTransform = forceTransform || false; 
    let newWidth = this.height;
    let newHeight = this.width;
    let oldWidth = this.width;
    let bottomLeft = this.getBottomLeftCoord();
    let newTopLeftX = bottomLeft[0];
    let newTopLeftY = bottomLeft[1] - newHeight + 1; // +1 because coord starts from 0
    let newCoordinates = [];    

    // this loop #1 check if crashing other components
    // also #2 generate new coordinates
    // doing together for efficent purpose
    for (let i = newTopLeftY; i < newTopLeftY + newHeight; i++) {
      for (let j = newTopLeftX; j < newTopLeftX + oldWidth; j++) {
        // ignore if crash into other components
        if(!forceTransform && matrix[j][i] === 1)
          return false;
          
        if (j <= newTopLeftX + newWidth - 1) 
          newCoordinates.push([j, i]);
      }
    }
    this.coordinates = newCoordinates;
    this.width = newWidth;
    this.height = newHeight;

    return true;
  }

  RectangleComponent.prototype.transformToHorizontal = function (boundaryRight, matrix, forceTransform) {
    forceTransform = forceTransform || false; 
    let newWidth = this.height;
    let newHeight = this.width;
    let bottomLeft = this.getBottomLeftCoord();
    let newTopLeftX = bottomLeft[0];
    let oldTopLeftY = this.coordinates[0][1];
    let newTopLeftY = bottomLeft[1] - newHeight + 1; // +1 because coord starts from 0
    let newCoordinates = [];

    // ignore if crash into canvas
    if (!forceTransform && newTopLeftX + newWidth - 1 > boundaryRight) // -1 because width starts from 1
      return;

    // this loop #1 check if crashing other components
    // also #2 generate new coordinates
    // doing together for efficent purpose
    for (let i = oldTopLeftY; i < oldTopLeftY + this.height; i++) {
      for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
        // ignore if crash into other components
        if (!forceTransform && matrix[j][i] === 1) return false;
      
        if (i >= newTopLeftY) 
          newCoordinates.push([j, i]);
      }
    }
    this.coordinates = newCoordinates;
    this.width = newWidth;
    this.height = newHeight;

    return true;
  }

  RectangleComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix, forceTransform) {
    forceTransform = forceTransform || false; 
    if (this.width > this.height) {
      return this.transformToVertical(matrix, forceTransform);
    } else {
      return this.transformToHorizontal(boundaryRight, matrix, forceTransform);
    }
  };

  RectangleComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
    this.speedX = speedX;
    this.speedY = speedY;
  }

  RectangleComponent.prototype.changeVertSpeed = function (speedY) {
    this.speedY = speedY;
  }

  RectangleComponent.prototype.isGameOver = function (boundaryTop) {
    return this.coordinates[0][1] <= boundaryTop;
  }


  function HalfCrossComponent(x, y) {
    this.width = 45;
    this.height = 30;
    this.done = false;

    (() => {
     // combination of one Rectangle componet and one square component
     this.squareComponent = new SquareComponent(x - this.width / 2, y, 15, 15 );
     this.rectangleComponent = new RectangleComponent(x - this.width / 2, this.height / 2 , 45, 15);
     this.coordinates = this.squareComponent.coordinates.concat(this.rectangleComponent.coordinates);
    })();
  }

  HalfCrossComponent.prototype.getTopLeftCoord = function () {
    let squareTopleftCoord = this.squareComponent.getTopLeftCoord();
    let rectangleTopLeftcoord = this.rectangleComponent.getTopLeftCoord();

    return squareTopleftCoord[1] < rectangleTopLeftcoord[1]
      ? squareTopleftCoord
      : rectangleTopLeftcoord;
  };

  HalfCrossComponent.prototype.getTopRightCoord = function () {
    let squareTopRightCoord = this.squareComponent.getTopRightCoord();
    let rectangleTopRightcoord = this.rectangleComponent.getTopRightCoord();

    return squareTopRightCoord[1] < rectangleTopRightcoord[1]
      ? squareTopRightCoord
      : rectangleTopRightcoord;
  }

  HalfCrossComponent.prototype.getBottomLeftCoord = function () {
    // let squareBottomLeftCCoord = this.squareComponent.getBottomLeftCoord();
    // let rectangleBottomLeftCcoord = this.rectangleComponent.getBottomLeftCoord();

    // return squareBottomLeftCCoord[0] < rectangleBottomLeftCcoord[0]
    //   ? squareBottomLeftCCoord
    //   : rectangleBottomLeftCcoord;
  }

  HalfCrossComponent.prototype.getBottomRightCoord = function () {
    // let squareBottomRightCCoord = this.squareComponent.getBottomRightCoord();
    // let rectangleBottomRightCcoord = this.rectangleComponent.getBottomRightCoord();
    // return squareBottomRightCCoord[0] > rectangleBottomRightCcoord[0]
    //   ? squareBottomRightCCoord
    //   : rectangleBottomRightCcoord;
  };

  HalfCrossComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let newSpeedX = 0;
    let newSpeedY = 0;

    if (this.squareComponent.speedX > 0) {
      // 1: Check if crash right
      this.squareComponent.checkCrashRight(boundaryRight, matrix);
      this.rectangleComponent.checkCrashRight(boundaryRight, matrix);
      newSpeedX = Math.min(this.squareComponent.speedX, this.rectangleComponent.speedX);
    }

    if (this.squareComponent.speedX < 0) {
      // 2: Check if crash left
      this.squareComponent.checkCrashLeft(boundaryLeft, matrix);
      this.rectangleComponent.checkCrashLeft(boundaryLeft, matrix);
      newSpeedX = Math.max(this.squareComponent.speedX, this.rectangleComponent.speedX);
    }

    // 3: check if crash into bottom
      this.squareComponent.checkCrashBottom(boundaryLeft, boundaryRight, bottomY, matrix);
      this.rectangleComponent.checkCrashBottom(boundaryLeft, boundaryRight, bottomY, matrix);

      newSpeedY = Math.min(this.squareComponent.speedY, this.rectangleComponent.speedY);

      this.done = this.rectangleComponent.done || this.squareComponent.done;

      this.squareComponent.speedX = newSpeedX;
      this.squareComponent.speedY = newSpeedY;
      this.rectangleComponent.speedX = newSpeedX;
      this.rectangleComponent.speedY = newSpeedY;

    // update pos
    this.squareComponent.updateCoord();
    this.rectangleComponent.updateCoord();
  };

  HalfCrossComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
    this.squareComponent.speedX = speedX;
    this.squareComponent.speedY = speedY;
    this.rectangleComponent.speedX = speedX;
    this.rectangleComponent.speedY = speedY;
  }

  HalfCrossComponent.prototype.changeVertSpeed = function (speedY) {
    this.squareComponent.speedY = speedY;
    this.rectangleComponent.speedY = speedY;
  }

  HalfCrossComponent.prototype.isGameOver = function (boundaryTop) {
    return this.squareComponent.isGameOver(boundaryTop) || this.rectangleComponent.isGameOver(boundaryTop)
  }

  HalfCrossComponent.prototype.rectangleToLeftTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let coord = this.rectangleComponent.getBottomLeftCoord();
    let coordX = coord[0];
    let rightBound = coordX + this.squareComponent.width;
    let coordY = coord[0] - this.squareComponent.height;
    let upperBound = coordY - this.squareComponent.height * 2;

    for (let i = coordX; i < rightBound; i++){
      for (let j = coordY; j > upperBound; j--){
        if(matrix[i][j] === 1)
          return false;
      }
    }
    return true;
  }

  HalfCrossComponent.prototype.rectangleToUpTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let coord = this.rectangleComponent.getTopLeftCoord();
    let coordX = coord[0] + this.squareComponent.width;
    let rightBound = coordX + this.squareComponent.width * 2;
    let coordY = coord[1];
    let lowerBound = coordY + this.squareComponent.height;

    if (rightBound - 1 > boundaryRight) return false;

    for (let i = coordX; i < rightBound; i++){
      for (let j = coordY; j < lowerBound; j++){
        if(matrix[i][j] === 1)
          return false;
      }
    }
    return true;
  }

  HalfCrossComponent.prototype.rectangleToRightTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let coord = this.squareComponent.getTopRightCoord();
    let coordX = coord[0] + 1;
    let rightBound = coordX + this.squareComponent.width;
    let coordY = coord[1];
    let lowerBound = coordY + this.squareComponent.height * 2;

    if (lowerBound - 1 > bottomY) return false;

    for (let i = coordX; i < rightBound; i++) {
      for (let j = coordY; j < lowerBound; j++) {
        if (matrix[i][j] === 1) return false;
      }
    }
    return true;
  }

  HalfCrossComponent.prototype.rectangleToDownTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let coord = this.squareComponent.getBottomRightCoord();
    let coordX = coord[0];
    let leftBound = coordX - this.squareComponent.width * 2;
    let coordY = coord[1] + 1;
    let lowerBound = coordY + this.squareComponent.height;

    // transfrom should not crash
    if (leftBound + 1 < boundaryLeft) return false;

    for (let i = coordX; i > leftBound; i--) {
      for (let j = coordY; j < lowerBound; j++) {
        if (matrix[i][j] === 1) return false;
      }
    }
    return true;
  }

  HalfCrossComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    const squareOnTop =
      this.squareComponent.coordinates[0][1] <
      this.rectangleComponent.coordinates[0][1];
    const squareOnRight =
      this.squareComponent.coordinates[0][0] >
      this.rectangleComponent.coordinates[
        this.rectangleComponent.coordinates.length - 1
      ][0];
    const squareOnBottom =
      this.squareComponent.coordinates[0][1] >
      this.rectangleComponent.coordinates[
        this.rectangleComponent.coordinates.length - 1
      ][1];
    const squareOnLeft =
      this.squareComponent.coordinates[
        this.squareComponent.coordinates.length - 1
      ][0] <
      this.rectangleComponent.coordinates[
        this.rectangleComponent.coordinates.length -
          this.rectangleComponent.width
      ][0];

    const offset = 2 * this.squareComponent.width;

    if (squareOnTop) {
      if (!this.rectangleToLeftTransform(boundaryLeft, boundaryRight, bottomY, matrix)) return false;
    } else if (squareOnRight) {
      if (!this.rectangleToUpTransform(boundaryLeft, boundaryRight, bottomY, matrix)) {
        return false;
      } else {
        this.rectangleComponent.coordinates.forEach((item) => {
          item[1] -= offset;
        });
      }
    } else if (squareOnBottom) {
      if (!this.rectangleToRightTransform(boundaryLeft, boundaryRight, bottomY, matrix)) {
        return false;
      } else {
        this.rectangleComponent.coordinates.forEach((item) => {
          item[0] += offset;
          item[1] += offset;
        });
      }
    } else if (squareOnLeft) {
      if (!this.rectangleToDownTransform(boundaryLeft, boundaryRight, bottomY, matrix)) {
        return false;
      } else {
        this.rectangleComponent.coordinates.forEach((item) => {
          item[0] -= offset;
        });
      }
    }

    this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix, true);

    const oldWidth = this.width;
    this.width = this.height;
    this.height = oldWidth;

    this.coordinates = this.squareComponent.coordinates.concat(this.rectangleComponent.coordinates);
  }

  function Component(x, y) {
    const getRandomInt = function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // const int = getRandomInt(0, 2);
    // if (int === 0) {
    //   return new SquareComponent(x, y);
    // } else if (int === 1)  {
    //   return new RectangleComponent(x, y);
    // } else if (int === 2){
    //   return new HalfCrossComponent(x, y);
    // }

    return new HalfCrossComponent(x, y);
  }

  window.Component = Component || {};
})();