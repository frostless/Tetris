(function () {
  "use strict";

  function Component(x, y) {
    this.width = 30;
    this.height = 30;
    this.x = x - this.width;
    this.y = y;
    this.speedX = 0;
    this.speedY = 5;
    // this.color = color;
    this.done = false;

    this.init = (() => {
      let coordinates = [];
      for (let i = this.y; i < this.height; i++) {
        for (let j = this.x; j < this.x + this.width; j++) {
          coordinates.push([j, i]);
        }
      }
      this.coordinates = coordinates;
    })();
  }

  Component.prototype.update = function (boundaryLeft, boundaryRight, bottomY, matrix) {
    // Check if crash canvas bottom
    let bottomIndex = this.coordinates.length - 1; //??
    let lowestPoint = this.coordinates[bottomIndex][1];

    if(lowestPoint + this.speedY >= bottomY){
      this.done = true;
      this.speedY  = bottomY - lowestPoint - 1;
    }

    // Check if crash other components bottom
    let length = this.coordinates.length - 1;
     // loop through the lowest Xs
    for (let i = length; i > length - this.width; i--) {
     let coordX = this.coordinates[i][0];
     let coordY = this.coordinates[i][1];
     if (matrix[coordX][coordY + this.speedY] === 1) {
        this.done = true;
        
        let firstCoordYNotTaken = coordY + this.speedY;
        while (matrix[coordX][firstCoordYNotTaken] === 1)
          firstCoordYNotTaken--; 
    
        this.speedY = firstCoordYNotTaken - coordY;
    
        break;
        }
      }

    if (this.speedX > 0) {
      // Check if crash canvas boundary right
      let rightMostPoint = this.coordinates[this.width - 1];
      let right = rightMostPoint[0];

      if (right + this.speedX >= boundaryRight)
        this.speedX = boundaryRight - right - 1;

      // Check if crash other components right
      let length = this.coordinates.length - 1;
      // loop through the lefmost Ys
      for (let i = 0; i < length; i += this.width) {
        let coordX = this.coordinates[i][0] + this.width - 1;
        let coordY = this.coordinates[i][1];
        if (matrix[coordX + this.speedX][coordY] === 1) {
          let firstCoordXNotTaken = coordX + this.speedX;
          while (matrix[firstCoordXNotTaken][coordY] === 1)
            firstCoordXNotTaken--;

          this.speedX = firstCoordXNotTaken - coordX;

          break;
        }
      }
    }

    if (this.speedX < 0) {
      // Check if crash canvas boundary left
      let left = this.coordinates[0][0];

      if (left + this.speedX <= boundaryLeft) 
        this.speedX = boundaryLeft - left;

      // Check if crash other components left
      let length = this.coordinates.length - 1;
      // loop through the lefmost Ys
      for (let i = 0; i < length; i += this.width) {
        let coordX = this.coordinates[i][0];
        let coordY = this.coordinates[i][1];
        if (matrix[coordX + this.speedX][coordY] === 1) {
          let firstCoordXNotTaken = coordX + this.speedX;
          while (matrix[firstCoordXNotTaken][coordY] === 1)
            firstCoordXNotTaken++;

          this.speedX = firstCoordXNotTaken - coordX;

          break;
        }
      }
    }
    // update pos
    this.coordinates.forEach((item)=>{
      item[0]+= this.speedX;
      item[1]+= this.speedY;
    })
  };

  window.Component = Component || {};
})();