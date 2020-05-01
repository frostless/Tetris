(function () {
  "use strict";

  function CubicComponent(x, y) {
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

  CubicComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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
      // 1: Check if crash canvas boundary right
      this.checkCrashCanvasRight(boundaryRight);
      // 2: Check if crash other components right
      this.checkCrashComponentRight(matrix, boundaryRight);
    }

    if (this.speedX < 0) {
      // 3: Check if crash canvas boundary left
      this.checkCrashCanvasLeft(boundaryLeft);
      // 4: Check if crash other components left
      this.checkCrashComponentLeft(matrix, boundaryLeft);
    }

    // 5: check if crash into the canvas's bottom
    this.checkCrashCanvasBottom(bottomY);
    // 6: Check if crash other components bottom
    if (!this.done)
      this.checkCrashComponentBottom(matrix, boundaryLeft, boundaryRight);

    // update pos
    this.coordinates.forEach((item) => {
      item[0] += this.speedX;
      item[1] += this.speedY;
    });
  };

  CubicComponent.prototype.checkCrashCanvasRight = function (boundaryRight) {
    let rightMostPoint = this.coordinates[this.width - 1]; // -1 because coordinates starts from 0
    let right = rightMostPoint[0];

    if (right + this.speedX >= boundaryRight)
      this.speedX = boundaryRight - right - 1; // -1 because matrix width starts from 0 but canvas from 1
  };

  CubicComponent.prototype.checkCrashCanvasLeft = function (boundaryLeft) {
    let left = this.coordinates[0][0];

    if (left + this.speedX <= boundaryLeft) 
      this.speedX = boundaryLeft - left; // no need to - 1 because boundary left is passed in as 0
  };

  CubicComponent.prototype.checkCrashComponentRight = function (matrix, boundaryRight) {
    // return if crash canvas
    if (this.coordinates[this.width - 1][0] + this.speedX >= boundaryRight)
      return;

    let length = this.coordinates.length;
    // loop through the lefmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0] + this.width - 1; // -1 because coordinates starts from 0
      let coordY = this.coordinates[i][1];
      if (matrix[coordX + this.speedX][coordY] === 1) {
        let firstCoordXNotTaken = coordX + this.speedX;
        while (matrix[firstCoordXNotTaken][coordY] === 1) firstCoordXNotTaken--;

        this.speedX = firstCoordXNotTaken - coordX;

        break;
      }
    }
  };

  CubicComponent.prototype.checkCrashComponentLeft = function (matrix, boundaryLeft) {
    let length = this.coordinates.length;
    // loop through the lefmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0];
      let coordY = this.coordinates[i][1];
      if (matrix[coordX + this.speedX][coordY] === 1) {
        let firstCoordXNotTaken = coordX + this.speedX;
        while (matrix[firstCoordXNotTaken][coordY] === 1) firstCoordXNotTaken++;

        this.speedX = firstCoordXNotTaken - coordX;

        break;
      }
    }
  };

  CubicComponent.prototype.checkCrashComponentBottom = function (matrix, boundaryLeft, boundaryRight) {
    let length = this.coordinates.length - 1; // -1 because coordinates starts from 0
    // loop through the lowest Xs
    for (let i = length; i > length - this.width; i--) {
      let coordX = this.coordinates[i][0];

      // take speedX into consideration, solution to bug mentioned earlier
      // ignore if the potential movent crash into canvas
      if (
        coordX + this.speedX > boundaryLeft &&
        coordX + this.speedX < boundaryRight
      ) {
        coordX += this.speedX;
      }

      let coordY = this.coordinates[i][1];
      if (matrix[coordX][coordY + this.speedY] === 1) {
        this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game

        let firstCoordYNotTaken = coordY + this.speedY;
        while (matrix[coordX][firstCoordYNotTaken] === 1) firstCoordYNotTaken--;

        this.speedY = firstCoordYNotTaken - coordY;

        break;
      }
    }
  };

  CubicComponent.prototype.checkCrashCanvasBottom = function (bottomY) {
    let bottomIndex = this.coordinates.length - 1;
    let lowestPoint = this.coordinates[bottomIndex][1];

    if (lowestPoint + this.speedY >= bottomY) {
      this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game
      this.speedY = bottomY - lowestPoint - 1; // -1 because the matrix's height starts from 0 but canvas from 1
    }
  }

  CubicComponent.prototype.transform = function () {
    // cubic shap does not transform
  }


  function LineComponent(x, y) {
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

  LineComponent.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
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
      // 1: Check if crash canvas boundary right
      this.checkCrashCanvasRight(boundaryRight);
      // 2: Check if crash other components right
      this.checkCrashComponentRight(matrix, boundaryRight);
    }

    if (this.speedX < 0) {
      // 3: Check if crash canvas boundary left
      this.checkCrashCanvasLeft(boundaryLeft);
      // 4: Check if crash other components left
      this.checkCrashComponentLeft(matrix, boundaryLeft);
    }

    // 5: check if crash into the canvas's bottom
    this.checkCrashCanvasBottom(bottomY);
    // 6: Check if crash other components bottom
    if (!this.done)
      this.checkCrashComponentBottom(matrix, boundaryLeft, boundaryRight);

    // update pos
    this.coordinates.forEach((item) => {
      item[0] += this.speedX;
      item[1] += this.speedY;
    });
  };

  LineComponent.prototype.checkCrashCanvasRight = function (boundaryRight) {
    let rightMostPoint = this.coordinates[this.width - 1]; // -1 because coordinates starts from 0
    let right = rightMostPoint[0];

    if (right + this.speedX >= boundaryRight)
      this.speedX = boundaryRight - right - 1; // -1 because matrix width starts from 0 but canvas from 1
  };

  LineComponent.prototype.checkCrashCanvasLeft = function (boundaryLeft) {
    let left = this.coordinates[0][0];

    if (left + this.speedX <= boundaryLeft) 
      this.speedX = boundaryLeft - left; // no need to - 1 because boundary left is passed in as 0
  };

  LineComponent.prototype.checkCrashComponentRight = function (matrix, boundaryRight) {
    // return if crash canvas
    if (this.coordinates[this.width - 1][0] + this.speedX >= boundaryRight)
      return;

    let length = this.coordinates.length;
    // loop through the lefmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0] + this.width - 1; // -1 because coordinates starts from 0
      let coordY = this.coordinates[i][1];
      if (matrix[coordX + this.speedX][coordY] === 1) {
        let firstCoordXNotTaken = coordX + this.speedX;
        while (matrix[firstCoordXNotTaken][coordY] === 1) firstCoordXNotTaken--;

        this.speedX = firstCoordXNotTaken - coordX;

        break;
      }
    }
  };

  LineComponent.prototype.checkCrashComponentLeft = function (matrix, boundaryLeft) {
    let length = this.coordinates.length;
    // loop through the lefmost Ys
    for (let i = 0; i < length; i += this.width) {
      let coordX = this.coordinates[i][0];
      let coordY = this.coordinates[i][1];
      if (matrix[coordX + this.speedX][coordY] === 1) {
        let firstCoordXNotTaken = coordX + this.speedX;
        while (matrix[firstCoordXNotTaken][coordY] === 1) firstCoordXNotTaken++;

        this.speedX = firstCoordXNotTaken - coordX;

        break;
      }
    }
  };

  LineComponent.prototype.checkCrashComponentBottom = function (matrix, boundaryLeft, boundaryRight) {
    let length = this.coordinates.length - 1; // -1 because coordinates starts from 0
    // loop through the lowest Xs
    for (let i = length; i > length - this.width; i--) {
      let coordX = this.coordinates[i][0];

      // take speedX into consideration, solution to bug mentioned earlier
      // ignore if the potential movent crash into canvas
      if (
        coordX + this.speedX > boundaryLeft &&
        coordX + this.speedX < boundaryRight
      ) {
        coordX += this.speedX;
      }

      let coordY = this.coordinates[i][1];
      if (matrix[coordX][coordY + this.speedY] === 1) {
        this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game

        let firstCoordYNotTaken = coordY + this.speedY;
        while (matrix[coordX][firstCoordYNotTaken] === 1) firstCoordYNotTaken--;

        this.speedY = firstCoordYNotTaken - coordY;

        break;
      }
    }
  };

  LineComponent.prototype.checkCrashCanvasBottom = function (bottomY) {
    let bottomIndex = this.coordinates.length - 1;
    let lowestPoint = this.coordinates[bottomIndex][1];

    if (lowestPoint + this.speedY >= bottomY) {
      this.done = this.speedX === 0; // allow more horizontal manevure, more like the original game
      this.speedY = bottomY - lowestPoint - 1; // -1 because the matrix's height starts from 0 but canvas from 1
    }
  }

  LineComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    let newWidth = this.height;
    let newHeight = this.width;
    let leftBottom = this.coordinates[this.coordinates.length - this.width];
    let newTopLeftX = leftBottom[0];

    if (this.width > this.height) {
      let newCoordinates = [];    
      let newTopLeftY = leftBottom[1] - newHeight;

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
      let oldTopLeft = this.coordinates[0][1];
      let newTopLeftY = leftBottom[1] - newHeight;

      // ignore if crash into canvas
      if (newTopLeftX + newWidth >= boundaryRight) 
        return;

      // this loop #1 check if crashing other components
      // also #2 generate new coordinates
      // #1 includes 2 for efficent purpose
      for (let i = oldTopLeft; i < oldTopLeft + this.height; i++) {
        for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
          // ignore if crash into other components
          if(matrix[j][i] === 1)
            return;    
        
          if(i>= newTopLeftY)        
            newCoordinates.push([j, i]);
        }
      }
      this.coordinates = newCoordinates;
      this.width = newWidth;
      this.height = newHeight;
    }
  };

  function Component(x, y) {
    const int = getRandomInt(0, 1);
    if (int === 0) {
      return new CubicComponent(x, y);
    } else {
      return new LineComponent(x, y);
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.Component = Component || {};
})();