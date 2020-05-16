(function () {
    "use strict";

    function HalfCrossComponent(x, y, width, height, speedY, basicLength) {
        this.width = width;
        this.height = height;
        this.speedY = speedY;
        this.basicLength = basicLength;
        this.done = false;

        (() => {
        // combination of one Rectangle componet and one square component
        this.squareComponent = new SquareComponent(x - basicLength / 2, y, basicLength, basicLength, speedY, basicLength);
        this.rectangleComponent = new RectangleComponent(x - basicLength / 2, y + height / 2 , basicLength * 3, basicLength, speedY, basicLength);
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

    window.HalfCrossComponent = HalfCrossComponent || {};
})();