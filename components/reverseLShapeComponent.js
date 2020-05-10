(function () {
    "use strict";

    function ReverseLShapeComponent(x, y) {
        this.width = 45;
        this.height = 30;
        this.done = false;

        (() => {
        // combination of one Square component and one Rectangle componet
        this.squareComponent = new SquareComponent(x - this.width / 2 + 15, y, 15, 15);
        this.rectangleComponent = new RectangleComponent(x - this.width / 2 , y + this.height / 2 , 45, 15);
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