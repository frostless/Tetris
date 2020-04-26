(function () {
  "use strict";

  function GameArea(width, height) {
    // the canvas starts from the 0, 0 by default
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    this.score = 0;

    // coordinates for the game, 0 not taken, 1 taken, 2 tetris
    this.init = (() => {
      let matrix = [];
      for (let i = 0; i < width; i++) {
        let matrixInner = [];
        for (let j = 0; j < height; j++) {
          matrixInner.push(0);
        }
        matrix.push(matrixInner);
      }
      this.matrix = matrix;
      this.component = new Component(width/2, 0)
    })();
  }

  GameArea.prototype.initNewComponent = function () {
    this.component = new Component(this.canvas.width/2, 0)
  };

  GameArea.prototype.drawCanvas = function () {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  };

  GameArea.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  GameArea.prototype.drawComponent = function () {
    // this.context.fillStyle = this.color;
    this.component.coordinates.forEach((item)=>{
      this.context.fillRect(item[0], item[1], 1, 1);
    })
  };

  GameArea.prototype.updateScoreBoard = function () {
    this.context.fillText('Score: ' + this.score, this.canvas.width - 60, 20);
  };

  GameArea.prototype.eraseComponent = function () {
    // this.context.fillStyle = this.color;
    this.component.coordinates.forEach((item)=>{
      this.context.clearRect(item[0], item[1], 1, 1);
    })
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
    let Comlength = this.component.coordinates.length - 1; //??
    let comCoordWidth = this.component.width;
    let shouldUpdateRest = false;
    // loop through the Ys
    for (let i = 0; i < Comlength; i += comCoordWidth) {
      let comCoordY = this.component.coordinates[i][1];
      let matrixlength = this.matrix.length - 1; // ??
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
    let matrixHeight = this.matrix[0].length; //?????
    let matrixLength = this.matrix.length; ///???
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
          this.context.fillRect(i, j, 1, 1);
        }
      }
    }
  };

  window.GameArea = GameArea || {};
})();
