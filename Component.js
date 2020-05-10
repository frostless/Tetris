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

  RectangleComponent.prototype.transformToVertical = function (matrix) {
    let newWidth = this.height;
    let newHeight = this.width;
    let bottomLeft = this.getBottomLeftCoord();
    let newTopLeftX = bottomLeft[0];
    let newTopLeftY = bottomLeft[1] - newHeight + 1; // +1 because coord starts from 0
    let newCoordinates = [];    

    // this loop #1 check if crashing other components
    // also #2 generate new coordinates
    // doing together for efficent purpose
    for (let i = newTopLeftY; i < newTopLeftY + newHeight; i++) {
      for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
        // ignore if crash into other components
        if (matrix[j][i] === 1) return false;

        newCoordinates.push([j, i]);
      }
    }
    this.coordinates = newCoordinates;
    this.width = newWidth;
    this.height = newHeight;

    return true;
  }

  RectangleComponent.prototype.transformToHorizontal = function (boundaryRight, matrix) {
    let newWidth = this.height;
    let newHeight = this.width;
    let bottomLeft = this.getBottomLeftCoord();
    let newTopLeftX = bottomLeft[0];
    let newTopLeftY = bottomLeft[1] - newHeight + 1; // +1 because coord starts from 0
    let newCoordinates = [];

    // ignore if crash into canvas
    if (newTopLeftX + newWidth - 1 > boundaryRight) // -1 because width starts from 1
      return false;

    // this loop #1 check if crashing other components
    // also #2 generate new coordinates
    // doing together for efficent purpose
    for (let i = newTopLeftY; i < newTopLeftY + newHeight; i++) {
      for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
        // ignore if crash into other components
        if (matrix[j][i] === 1) return false;
      
        newCoordinates.push([j, i]);
      }
    }
    this.coordinates = newCoordinates;
    this.width = newWidth;
    this.height = newHeight;

    return true;
  }

  RectangleComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    if (this.width > this.height) {
      return this.transformToVertical(matrix);
    } else {
      return this.transformToHorizontal(boundaryRight, matrix);
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
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if (!transform) 
        return false;
    } else if (squareOnRight) {
      // change coord first,revert later if transform fail
      this.rectangleComponent.coordinates.forEach((item) => {
        item[1] -= offset;
      });
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transform){
        this.rectangleComponent.coordinates.forEach((item) => {
          item[1] += offset;
        });
        return;
      }
    } else if (squareOnBottom) {
      // ignore if crash the canvas
      let bottomRightCoord = this.rectangleComponent.getBottomRightCoord();
      let bottomRightCoordY = bottomRightCoord[1];
      if (bottomRightCoordY + offset > bottomY) return;
       // change coord first,revert later if transform fail
      this.rectangleComponent.coordinates.forEach((item) => {
          item[0] += offset;
          item[1] += offset;
      });
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transform){
        this.rectangleComponent.coordinates.forEach((item) => {
          item[0] -= offset;
          item[1] -= offset;
        });
        return;
      }
    } else if (squareOnLeft) {
      // ignore if crash the canvas
      let topLeftCoord = this.rectangleComponent.getTopLeftCoord();
      let topLeftCoordX = topLeftCoord[0];
      if (topLeftCoordX - offset < boundaryLeft) return;
      // change coord first,revert later if transform fail
      this.rectangleComponent.coordinates.forEach((item) => {
        item[0] -= offset;
      });
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      if(!transform){
        this.rectangleComponent.coordinates.forEach((item) => {
          item[0] += offset;
        });
      return;
      }
    }

    const oldWidth = this.width;
    this.width = this.height;
    this.height = oldWidth;
    this.coordinates = this.squareComponent.coordinates.concat(this.rectangleComponent.coordinates);
  }


  function ZShapeComponent(x, y) {
    this.width = 45;
    this.height = 30;
    this.done = false;

    (() => {
     // combination of two Rectangle componets
     this.rectangleComponent1 = new RectangleComponent(x - 15, y, 30, 15);
     this.rectangleComponent2 = new RectangleComponent(x, this.height / 2 , 30, 15);
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


  function ReverseZShapeComponent(x, y) {
    this.width = 45;
    this.height = 30;
    this.done = false;

    (() => {
     // combination of two Rectangle componets
     this.rectangleComponent1 = new RectangleComponent(x + 15, y, 30, 15);
     this.rectangleComponent2 = new RectangleComponent(x, this.height / 2 , 30, 15);
     this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
    })();
  }

  ReverseZShapeComponent.prototype.getTopLeftCoord = function () {
    let rectangle1TopleftCoord = this.rectangleComponent1.getTopLeftCoord();
    let rectangle2TopLeftcoord = this.rectangleComponent2.getTopLeftCoord();

    return rectangle1TopleftCoord[1] < rectangle2TopLeftcoord[1]
      ? rectangle1TopleftCoord
      : rectangle2TopLeftcoord;
  };

  ReverseZShapeComponent.prototype.getTopRightCoord = function () {
    let rectangle1TopRightCoord = this.rectangleComponent1.getTopRightCoord();
    let rectangle2TopRightcoord = this.rectangleComponent2.getTopRightCoord();

    return rectangle1TopRightCoord[1] < rectangle2TopRightcoord[1]
      ? rectangle1TopRightCoord
      : rectangle2TopRightcoord;
  }

  ReverseZShapeComponent.prototype.getBottomLeftCoord = function () {
  }

  ReverseZShapeComponent.prototype.getBottomRightCoord = function () {
  };

  ReverseZShapeComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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

  ReverseZShapeComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
    this.rectangleComponent1.speedX = speedX;
    this.rectangleComponent1.speedY = speedY;
    this.rectangleComponent2.speedX = speedX;
    this.rectangleComponent2.speedY = speedY;
  }

  ReverseZShapeComponent.prototype.changeVertSpeed = function (speedY) {
    this.rectangleComponent1.speedY = speedY;
    this.rectangleComponent2.speedY = speedY;
  }

  ReverseZShapeComponent.prototype.isGameOver = function (boundaryTop) {
    return this.rectangleComponent1.isGameOver(boundaryTop) || this.rectangleComponent2.isGameOver(boundaryTop)
  }

  ReverseZShapeComponent.prototype.transformToN = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let offset = Math.min(this.rectangleComponent1.height, this.rectangleComponent1.width) * 2;
    let bottomLeftCoord = this.rectangleComponent1.getBottomLeftCoord();
    let bottomLeftCoordY = bottomLeftCoord[1];
    // ignore if crash into canvas
    if (bottomLeftCoordY + offset >  bottomY)
      return;
    // change coord first,revert later if transform fail
    this.rectangleComponent1.coordinates.forEach((item) => {
      item[1] += offset;
    });
    let transfrom1 = this.rectangleComponent1.transform(boundaryLeft, boundaryRight, bottomY, matrix)
    if(!transfrom1){
      this.rectangleComponent1.coordinates.forEach((item) => {
        item[1] -= offset;
      });
      return;
    }
    let transfrom2 = this.rectangleComponent2.transform(boundaryLeft, boundaryRight, bottomY, matrix)
    if(!transfrom2){
      //revert rectangleComponent1
      this.rectangleComponent1.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
      return;
    }

    const oldWidth = this.width;
    this.width = this.height;
    this.height = oldWidth;
    this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
  }

  ReverseZShapeComponent.prototype.transformToZ = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
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
      return;
    }
    let transfrom2 = this.rectangleComponent2.transform(boundaryLeft, boundaryRight, bottomY, matrix)
    if(!transfrom2){
      //revert rectangleComponent1
      this.rectangleComponent1.transform(boundaryLeft, boundaryRight, bottomY, matrix)
      this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
      return;
    }

    const oldWidth = this.width;
    this.width = this.height;
    this.height = oldWidth;
    this.coordinates = this.rectangleComponent1.coordinates.concat(this.rectangleComponent2.coordinates);
  }

  ReverseZShapeComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    if(this.width > this.height)
      this.transformToN(boundaryLeft, boundaryRight, bottomY, matrix);
    else
      this.transformToZ(boundaryLeft, boundaryRight, bottomY, matrix);
  }



  function LShapeComponent(x, y) {
    this.width = 45;
    this.height = 30;
    this.done = false;

    (() => {
     // combination of one Square component and one Rectangle componet
     this.squareComponent = new SquareComponent(x - this.width / 2 - 15, y, 15, 15);
     this.rectangleComponent = new RectangleComponent(x - this.width / 2 , this.height / 2 , 45, 15);
     this.coordinates = this.squareComponent.coordinates.concat(this.rectangleComponent.coordinates);
    })();
  }

  LShapeComponent.prototype.getTopLeftCoord = function () {
    let squareTopleftCoord = this.squareComponent.getTopLeftCoord();
    let rectangleTopLeftcoord = this.rectangleComponent.getTopLeftCoord();

    return squareTopleftCoord[1] < rectangleTopLeftcoord[1]
      ? squareTopleftCoord
      : rectangleTopLeftcoord;
  };

  LShapeComponent.prototype.getTopRightCoord = function () {
    let squareTopRightCoord = this.squareComponent.getTopRightCoord();
    let rectangleTopRightcoord = this.rectangleComponent.getTopRightCoord();

    return squareTopRightCoord[1] < rectangleTopRightcoord[1]
      ? squareTopRightCoord
      : rectangleTopRightcoord;
  }

  LShapeComponent.prototype.getBottomLeftCoord = function () {
  }

  LShapeComponent.prototype.getBottomRightCoord = function () {
  };

  LShapeComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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

      this.done = this.squareComponent.done || this.rectangleComponent.done;

      this.squareComponent.speedX = newSpeedX;
      this.squareComponent.speedY = newSpeedY;
      this.rectangleComponent.speedX = newSpeedX;
      this.rectangleComponent.speedY = newSpeedY;

    // update pos
    this.squareComponent.updateCoord();
    this.rectangleComponent.updateCoord();
  };

  LShapeComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
    this.squareComponent.speedX = speedX;
    this.squareComponent.speedY = speedY;
    this.rectangleComponent.speedX = speedX;
    this.rectangleComponent.speedY = speedY;
  }

  LShapeComponent.prototype.changeVertSpeed = function (speedY) {
    this.squareComponent.speedY = speedY;
    this.rectangleComponent.speedY = speedY;
  }

  LShapeComponent.prototype.isGameOver = function (boundaryTop) {
    return this.squareComponent.isGameOver(boundaryTop) || this.rectangleComponent.isGameOver(boundaryTop)
  }

  LShapeComponent.prototype.squareOnTopTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let coordX = this.squareComponent.getBottomRightCoord()[0] +  this.squareComponent.width;
    let rightBound = coordX + this.squareComponent.width;
    let coordY = this.squareComponent.getBottomRightCoord()[1];
    let lowerBound = coordY + this.squareComponent.height;
    let offset = this.squareComponent.height;
    // ignore if crash into canvas
    if (coordY + this.squareComponent.height * 2 > bottomY)
      return false;
    // ignore if crash into other components
    for (let i = coordX; i < rightBound; i++){
      for (let j = coordY; j< lowerBound; j++){
        if(matrix[i][j] === 1)
          return false;
      }
    }
     // change coord first,revert later if transform fail
     this.rectangleComponent.coordinates.forEach((item) => {
      item[1] += offset;
    });
    let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
    if(!transform){
      this.rectangleComponent.coordinates.forEach((item) => {
        item[1] -= offset;
      });
      return false;
    }

    return true;
  }

  LShapeComponent.prototype.squareOnRightTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let coordX = this.squareComponent.getBottomRightCoord()[0] + 1;
    let rightBound = coordX + this.squareComponent.width;
    let coordY = this.squareComponent.getBottomRightCoord()[1] + 1;
    let lowerBound = coordY + this.squareComponent.height;
    let offset = this.squareComponent.height;
    // ignore if crash into canvas
    if (rightBound - 1 > boundaryRight)
      return false;
    // ignore if crash into other components
    for (let i = coordX; i < rightBound; i++){
      for (let j = coordY; j< lowerBound; j++){
        if(matrix[i][j] === 1)
          return false;
      }
    }
    // change coord first,revert later if transform fail
    this.rectangleComponent.coordinates.forEach((item) => {
      item[1] -= offset * 2;
    });
    let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
    if(!transform){
      this.rectangleComponent.coordinates.forEach((item) => {
        item[1] += offset * 2;
      });
      return false;
    }

    return true;
  }

  LShapeComponent.prototype.squareOnBottomTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let coordX = this.squareComponent.getBottomLeftCoord()[0] - 1;
    let leftBound = coordX - this.squareComponent.width;
    let coordY = this.squareComponent.getTopLeftCoord()[1];
    let lowerBound = coordY + this.squareComponent.height;
    let offset = this.squareComponent.height;
    // ignore if crash into other components
    for (let i = coordX; i > leftBound; i--){
      for (let j = coordY; j < lowerBound; j++){
        if(matrix[i][j] === 1)
          return false;
      }
    }
    // change coord first,revert later if transform fail
    this.rectangleComponent.coordinates.forEach((item) => {
      item[0] += offset * 2;
      item[1] += offset;
    });
    let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
    if(!transform){
      this.rectangleComponent.coordinates.forEach((item) => {
        item[0] -= offset * 2;
        item[1] -= offset;
      });
      return false;
    }

    return true;
  }

  LShapeComponent.prototype.squareOnLeftTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let coordX = this.squareComponent.getTopLeftCoord()[0] - 1;
    let leftBound = coordX - this.squareComponent.width;
    let coordY = this.squareComponent.getBottomLeftCoord()[1];
    let upperBound = coordY - this.squareComponent.height * 2;
    let offset = this.squareComponent.height;
     // ignore if crash into canvas
     if (coordX - this.squareComponent.width + 1 < boundaryLeft)
       return false;

    // ignore if crash into other components
    for (let i = coordX; i > leftBound; i--){
      for (let j = coordY; j > upperBound; j--){
        if(matrix[i][j] === 1)
          return false;
      }
    }
    // change coord first,revert later if transform fail
    this.rectangleComponent.coordinates.forEach((item) => {
      item[0] -= offset * 2;
    });
    let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
    if(!transform){
      this.rectangleComponent.coordinates.forEach((item) => {
        item[0] += offset * 2;
      });
      return false;
    }

    return true;
  }   

  LShapeComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let offset = this.squareComponent.height;
    let squareOnTop = this.squareComponent.getBottomRightCoord()[1] < this.rectangleComponent.getTopRightCoord()[1];
    let squareOnRight = this.squareComponent.getTopLeftCoord()[0] > this.rectangleComponent.getTopRightCoord()[0];
    let squareOnBottom = this.squareComponent.getTopLeftCoord()[1] > this.rectangleComponent.getBottomLeftCoord()[1];
    let squareOnLeft = this.squareComponent.getBottomRightCoord()[0] < this.rectangleComponent.getBottomLeftCoord()[0];
    if(squareOnTop){
      let transform = this.squareOnTopTransform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform)
        return;

      this.squareComponent.coordinates.forEach((item) => {
        item[0] += offset;
      });
    } else if(squareOnRight){
      let transform = this.squareOnRightTransform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform)
        return;

      this.squareComponent.coordinates.forEach((item) => {
        item[0] += offset;
        item[1] += offset;
      });
    } else if(squareOnBottom){
      let transform = this.squareOnBottomTransform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform)
        return;

      this.squareComponent.coordinates.forEach((item) => {
        item[0] -= offset;
      });
    } else if(squareOnLeft){
      let transform = this.squareOnLeftTransform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform)
        return;

      this.squareComponent.coordinates.forEach((item) => {
        item[0] -= offset;
        item[1] -= offset
      });
    }

    const oldWidth = this.width;
    this.width = this.height;
    this.height = oldWidth;
    this.coordinates = this.squareComponent.coordinates.concat(this.rectangleComponent.coordinates);
  }


  function ReverseLShapeComponent(x, y) {
    this.width = 45;
    this.height = 30;
    this.done = false;

    (() => {
     // combination of one Square component and one Rectangle componet
     this.squareComponent = new SquareComponent(x - this.width / 2 + 15, y, 15, 15);
     this.rectangleComponent = new RectangleComponent(x - this.width / 2 , this.height / 2 , 45, 15);
     this.coordinates = this.squareComponent.coordinates.concat(this.rectangleComponent.coordinates);
    })();
  }

  ReverseLShapeComponent.prototype.getTopLeftCoord = function () {
    let squareTopleftCoord = this.squareComponent.getTopLeftCoord();
    let rectangleTopLeftcoord = this.rectangleComponent.getTopLeftCoord();

    return squareTopleftCoord[1] < rectangleTopLeftcoord[1]
      ? squareTopleftCoord
      : rectangleTopLeftcoord;
  };

  ReverseLShapeComponent.prototype.getTopRightCoord = function () {
    let squareTopRightCoord = this.squareComponent.getTopRightCoord();
    let rectangleTopRightcoord = this.rectangleComponent.getTopRightCoord();

    return squareTopRightCoord[1] < rectangleTopRightcoord[1]
      ? squareTopRightCoord
      : rectangleTopRightcoord;
  }

  ReverseLShapeComponent.prototype.getBottomLeftCoord = function () {
  }

  ReverseLShapeComponent.prototype.getBottomRightCoord = function () {
  };

  ReverseLShapeComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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

      this.done = this.squareComponent.done || this.rectangleComponent.done;

      this.squareComponent.speedX = newSpeedX;
      this.squareComponent.speedY = newSpeedY;
      this.rectangleComponent.speedX = newSpeedX;
      this.rectangleComponent.speedY = newSpeedY;

    // update pos
    this.squareComponent.updateCoord();
    this.rectangleComponent.updateCoord();
  };

  ReverseLShapeComponent.prototype.changeHoriSpeed = function (speedX, speedY) {
    this.squareComponent.speedX = speedX;
    this.squareComponent.speedY = speedY;
    this.rectangleComponent.speedX = speedX;
    this.rectangleComponent.speedY = speedY;
  }

  ReverseLShapeComponent.prototype.changeVertSpeed = function (speedY) {
    this.squareComponent.speedY = speedY;
    this.rectangleComponent.speedY = speedY;
  }

  ReverseLShapeComponent.prototype.isGameOver = function (boundaryTop) {
    return this.squareComponent.isGameOver(boundaryTop) || this.rectangleComponent.isGameOver(boundaryTop)
  }

  ReverseLShapeComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
    let squareOnTop = this.squareComponent.getBottomRightCoord()[1] < this.rectangleComponent.getTopRightCoord()[1];
    let squareOnRight = this.squareComponent.getTopLeftCoord()[0] > this.rectangleComponent.getTopRightCoord()[0];
    let squareOnBottom = this.squareComponent.getTopLeftCoord()[1] > this.rectangleComponent.getBottomLeftCoord()[1];
    let squareOnLeft = this.squareComponent.getBottomRightCoord()[0] < this.rectangleComponent.getBottomLeftCoord()[0];
    if(squareOnTop){
      let offset = this.squareComponent.height;
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform)
        return;

      this.squareComponent.coordinates.forEach((item) => {
        item[0] -= offset;
        item[1] += offset;
      });
    } else if(squareOnRight){
      let offset = this.squareComponent.height;
      // change coord first,revert later if transform fail
      this.rectangleComponent.coordinates.forEach((item) => {
        item[1] -= offset * 2;
      });
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform){
        this.rectangleComponent.coordinates.forEach((item) => {
          item[1] += offset * 2;
        });
        return;
      }

      this.squareComponent.coordinates.forEach((item) => {
        item[0] -= offset;
        item[1] -= offset;
      });
    } else if(squareOnBottom){
      let coordY = this.squareComponent.getBottomLeftCoord()[1];
      let lowerBound = coordY + this.squareComponent.height;
      let offset = this.squareComponent.height;
        // ignore if crash into canvas
      if(lowerBound > bottomY)
        return;
      // change coord first,revert later if transform fail
      this.rectangleComponent.coordinates.forEach((item) => {
        item[0] += offset * 2;
        item[1] += offset * 2;
      });
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform){
        this.rectangleComponent.coordinates.forEach((item) => {
          item[0] -= offset * 2;
          item[1] -= offset * 2;
        });
        return;
      }

      this.squareComponent.coordinates.forEach((item) => {
        item[0] += offset;
        item[1] -= offset;
      });
    } else if(squareOnLeft){
      let coordX = this.squareComponent.getTopLeftCoord()[0];
      let leftBound = coordX - this.squareComponent.width;
      let offset = this.squareComponent.height;

      // ignore if crash into canvas
      if(leftBound < boundaryLeft)
        return;
      // change coord first,revert later if transform fail
      this.rectangleComponent.coordinates.forEach((item) => {
        item[0] -= offset * 2;
      });
      let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
      if(!transform){
        this.rectangleComponent.coordinates.forEach((item) => {
          item[0] += offset * 2;
        });
        return;
      }

      this.squareComponent.coordinates.forEach((item) => {
        item[0] += offset;
        item[1] += offset
      });
    }

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

    const int = getRandomInt(0, 5);
    if (int === 0) {
      return new SquareComponent(x, y);
    } else if (int === 1)  {
      return new RectangleComponent(x, y);
    } else if (int === 2){
      return new HalfCrossComponent(x, y);
    } else if (int === 3){
      return new ZShapeComponent(x, y);
    } else if (int === 4){
      return new ReverseZShapeComponent(x, y);
    } else if (int === 5){
      return new LShapeComponent(x, y);
    } else if (int === 6){
      return new ReverseLShapeComponent(x, y);
    }

    // return new LShapeComponent(x, y);
  }

  window.Component = Component || {};
})();