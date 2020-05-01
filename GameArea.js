(function () {
  "use strict";

  function GameArea(convasX, convasY, width, height, drawer) {
    this.x = convasX;
    this.y = convasY;
    this.drawer = drawer;
    this.width = width;
    this.height = height;
    this.score = 0;

    // coordinates for the game, 0 not taken, 1 taken, 2 tetris
    (() => {
      let matrix = [];
      for (let i = convasX; i < convasX + width; i++) {
        let matrixInner = [];
        for (let j = convasY; j < convasY + height; j++) {
          matrixInner.push(0);
        }
        matrix.push(matrixInner);
      }
      this.matrix = matrix;
    })();
  }

  GameArea.prototype.initComponent = function () {
    this.component = new Component(this.x + this.width/2, this.y)
  };

  GameArea.prototype.initCanvas = function () {
    this.drawer.initCanvas();
  };

  GameArea.prototype.clearCanvas = function () {
    this.drawer.clearRect(0, 0, this.width, this.height);
  };

  GameArea.prototype.drawComponent = function () {
    // this.context.fillStyle = this.color;
    this.component.coordinates.forEach((item) => {
      this.drawer.fillRect(item[0], item[1], 1, 1);
    });
  };

  GameArea.prototype.eraseComponent = function () {
    // this.context.fillStyle = this.color;
    this.component.coordinates.forEach((item)=>{
      this.drawer.clearRect(item[0], item[1], 1, 1);
    })
  };

  GameArea.prototype.transformComponent = function () {
    this.eraseComponent();
    this.component.transform(this.x, this.x + this.width, this.y + this.height, this.matrix);
    this.drawComponent();
  };

  GameArea.prototype.updateComponent = function () {
    this.component.update(this.x, this.x + this.width, this.y + this.height, this.matrix);
  };

  GameArea.prototype.updateScoreBoard = function () {
    this.drawer.clearRect(this.x + this.width - 60, this.y, 100, 100);
    this.drawer.fillText('Score: ' + this.score, this.x + this.width - 60, 20);
  };

  GameArea.prototype.isComponentDone = function () {
    return this.component.done;
  };

  GameArea.prototype.isGameOver = function () {
    return this.component.coordinates[0][1] <= 0;
  };

  GameArea.prototype.updateMatrix = function () {
    this.component.coordinates.forEach((item) => {
      // 1 means taken
      this.matrix[item[0]][item[1]] = 1;
    });
  };

  GameArea.prototype.tetris = function () {
    // 1: mark tetrix states
    let Comlength = this.component.coordinates.length;
    let comCoordWidth = this.component.width;
    let shouldUpdateRest = false;
    // loop through the Ys
    for (let i = 0; i < Comlength; i += comCoordWidth) {
      let comCoordY = this.component.coordinates[i][1];
      let matrixlength = this.matrix.length;
      let tetris = true;
      for (let j = 0; j < matrixlength; j++) {
        if (this.matrix[j][comCoordY] === 0) {
          tetris = false;
          break;
        }
      }

      if (tetris) {
        this.score ++;
        shouldUpdateRest = true;
        for (let k = 0; k < matrixlength; k++) {
          this.matrix[k][comCoordY] = 2;
        }
      }
    }

    // 2: update the rest of matrix
    // from downwards
    if (!shouldUpdateRest) return;
    let lines = 0;
    let matrixHeight = this.matrix[0].length - 1; // -1 because matrix height starts from 0 not 1
    let matrixLength = this.matrix.length;
    for (let i = matrixHeight; i > 0; i--) {
      if (this.matrix[0][i] === 2) {
        lines++;
        // update all to 0   
        for (let j = 0; j < matrixLength; j++) {
          this.matrix[j][i] = 0;
        }
      } else {
        if (lines > 0) {
          // update new pos by lines
          for (let j = 0; j < matrixLength; j++) {
            let originalVal = this.matrix[j][i];
            this.matrix[j][i] = 0;
            this.matrix[j][i + lines] = originalVal;
          }
        }
      }
    }
    // 3: update canvas
    this.clearCanvas();
    for (let i = 0; i < matrixLength; i++) {
      for (let j = 0; j < matrixHeight; j++) {
        if (this.matrix[i][j] === 1) {
          this.drawer.fillRect(i, j, 1, 1);
        }
      }
    }
  };

  window.GameArea = GameArea || {};
})();