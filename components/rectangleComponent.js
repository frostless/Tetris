(function () {
    "use strict";

    function RectangleComponent(x, y, width, height, speedY, basicLength) {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = speedY;
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
            if (coordX + j === boundaryRight + 1 || matrix[coordX + j][coordY][0] === 1) {
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
            if (coordX + j === boundaryLeft - 1 || matrix[coordX + j][coordY][0] === 1) {
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
            if (coordY + j === bottomY + 1 || matrix[coordX][coordY + j][0] === 1) {
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
        if(newTopLeftY < 0) return false; // in case higher than canvas top
        let newCoordinates = [];  
        
        // this loop #1 check if crashing other components
        // also #2 generate new coordinates
        // doing together for efficent purpose
        for (let i = newTopLeftY; i < newTopLeftY + newHeight; i++) {
            for (let j = newTopLeftX; j < newTopLeftX + newWidth; j++) {
                // ignore if crash into other components
                if (matrix[j][i][0] === 1) return false;

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
                if (matrix[j][i][0] === 1) return false;
            
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

    window.RectangleComponent = RectangleComponent || {};
})();