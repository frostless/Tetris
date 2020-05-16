(function () {
    "use strict";

    function ReverseLShapeComponent(x, y, width, height, basicLength) {
        this.width = width;
        this.height = height;
        this.speedY = basicLength;
        this.basicLength = basicLength;
        this.done = false;

        (() => {
        // combination of one Square component and one Rectangle componet
        this.squareComponent = new SquareComponent(x + basicLength * 1.5, y, basicLength, basicLength, basicLength);
        this.rectangleComponent = new RectangleComponent(x + basicLength / 2 , y + height / 2 , basicLength * 3, basicLength, basicLength);
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

    ReverseLShapeComponent.prototype.update = function (bottomY, matrix) {
        let newSpeedY = 0;

        this.squareComponent.checkCrashBottom(bottomY, matrix);
        this.rectangleComponent.checkCrashBottom(bottomY, matrix);

        newSpeedY = Math.min(this.squareComponent.speedY, this.rectangleComponent.speedY);

        this.done = this.squareComponent.done || this.rectangleComponent.done;

        this.squareComponent.speedY = newSpeedY;
        this.rectangleComponent.speedY = newSpeedY;

        // update pos
        this.squareComponent.updateCoord();
        this.rectangleComponent.updateCoord();
    };

    ReverseLShapeComponent.prototype.changeHorizontalSpeed = function (speedX, matrix, boundaryLeft, boundaryRight) {
        if (speedX > 0) {
            this.squareComponent.checkCrashRight(speedX, boundaryRight, matrix);
            this.rectangleComponent.checkCrashRight(speedX, boundaryRight, matrix);
            let x = Math.min(this.squareComponent.speedX, this.rectangleComponent.speedX);
            this.squareComponent.updateX(x);
            this.rectangleComponent.updateX(x);
          } else {
            this.squareComponent.checkCrashLeft(speedX, boundaryLeft, matrix);
            this.rectangleComponent.checkCrashLeft(speedX, boundaryLeft, matrix);
            let x = Math.max(this.squareComponent.speedX, this.rectangleComponent.speedX);
            this.squareComponent.updateX(x);
            this.rectangleComponent.updateX(x);
          }
    }

    ReverseLShapeComponent.prototype.revertHorizontalSpeed = function () {
        this.squareComponent.revertHorizontalSpeed();
        this.rectangleComponent.revertHorizontalSpeed();
    }

    ReverseLShapeComponent.prototype.isGameOver = function (boundaryTop) {
        return this.squareComponent.isGameOver(boundaryTop) || this.rectangleComponent.isGameOver(boundaryTop)
    }

    ReverseLShapeComponent.prototype.squareOnTopTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
        let transform = this.rectangleComponent.transform(boundaryLeft, boundaryRight, bottomY, matrix);
        if(!transform)
            return false;

        return true;
    }

    ReverseLShapeComponent.prototype.squareOnRightTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
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
        return false;
        }

        return true;    
    }

    ReverseLShapeComponent.prototype.squareOnBottomTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
        let coordY = this.squareComponent.getBottomLeftCoord()[1];
        let lowerBound = coordY + this.squareComponent.height;
        let offset = this.squareComponent.height;
        // ignore if crash into canvas
        if(lowerBound > bottomY)
        return false;
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
        return false;
        }

        return true;
    }

    ReverseLShapeComponent.prototype.squareOnLeftTransform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
        let coordX = this.squareComponent.getTopLeftCoord()[0];
        let leftBound = coordX - this.squareComponent.width;
        let offset = this.squareComponent.height;

        // ignore if crash into canvas
        if(leftBound < boundaryLeft)
        return false;
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

    ReverseLShapeComponent.prototype.transform = function (boundaryLeft, boundaryRight, bottomY, matrix) { 
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
                item[0] -= offset;
                item[1] += offset;
            });
        } else if(squareOnRight){
            let transform = this.squareOnRightTransform(boundaryLeft, boundaryRight, bottomY, matrix);
            if(!transform)
                return;

            this.squareComponent.coordinates.forEach((item) => {
                item[0] -= offset;
                item[1] -= offset;
            });
        } else if(squareOnBottom){
            let transform = this.squareOnBottomTransform(boundaryLeft, boundaryRight, bottomY, matrix);
            if(!transform)
                return;

            this.squareComponent.coordinates.forEach((item) => {
                item[0] += offset;
                item[1] -= offset;
            });
        } else if(squareOnLeft){
        let transform = this.squareOnLeftTransform(boundaryLeft, boundaryRight, bottomY, matrix);
        if(!transform)
            return;

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

    window.ReverseLShapeComponent = ReverseLShapeComponent || {};
})();