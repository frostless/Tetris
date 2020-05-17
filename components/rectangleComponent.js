(function () {
    "use strict";

    function RectangleComponent(x, y, width, height, basicLength) {
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

    RectangleComponent.prototype.update = function (bottomY, matrix) {
        this.checkCrashBottom(bottomY, matrix);
        // update pos
        this.updateCoord();
    };

    RectangleComponent.prototype.checkCrashRight = function (speedX, boundaryRight, matrix) {
        let length = this.coordinates.length;
        let smallestSpeedX = speedX;
        // loop through the rightmost coord
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

    RectangleComponent.prototype.checkCrashLeft = function (speedX, boundaryLeft, matrix) {
        let length = this.coordinates.length;
        let smallestSpeedX = speedX;
        // loop through the lefmost coord
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

    RectangleComponent.prototype.checkCrashBottom = function (bottomY, matrix) {
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

    RectangleComponent.prototype.updateCoord = function () {
        this.coordinates.forEach((item) => {
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
                if (matrix[j][i] && matrix[j][i][0] === 1) return false;

                let borderXLine = (i - newTopLeftY + 1) % this.basicLength === 0;
                let borderYLine = (j - newTopLeftX + 1) % this.basicLength === 0;
                if (borderXLine || borderYLine) {
                    newCoordinates.push([j, i, 1]); // 1 means border, different color
                } else {
                    newCoordinates.push([j, i, 0]); // 0 means no border
                }
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
                if (matrix[j][i] && matrix[j][i][0] === 1) return false;
            
                let borderXLine = (i - newTopLeftY + 1) % this.basicLength === 0;
                let borderYLine = (j - newTopLeftX + 1) % this.basicLength === 0;
                if (borderXLine || borderYLine) {
                    newCoordinates.push([j, i, 1]); // 1 means border, different color
                } else {
                    newCoordinates.push([j, i, 0]); // 0 means no border
                }
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

    RectangleComponent.prototype.revertHorizontalSpeed = function () {
        this.speedX = 0;
    };

    RectangleComponent.prototype.changeHorizontalSpeed = function (speedX, matrix, boundaryLeft, boundaryRight) {
        if (speedX > 0) {
          this.checkCrashRight(speedX, boundaryRight, matrix)
          this.updateX(this.speedX);
        } else {
          this.checkCrashLeft(speedX, boundaryLeft, matrix) 
          this.updateX(this.speedX);
        }
    }

    RectangleComponent.prototype.updateX = function (x) {
        this.coordinates.forEach((item) => {
          item[0] += x;
        });
      }

    RectangleComponent.prototype.isGameOver = function (boundaryTop) {
        return this.coordinates[0][1] <= boundaryTop;
    }

    window.RectangleComponent = RectangleComponent || {};
})();