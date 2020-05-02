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
    this.drawer.clearRect(this.x, this.y, this.width, this.height);
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
    // -1 because canvas starts from 1 but matrix from 0
    this.component.transform(this.x, this.x + this.width - 1, this.y + this.height - 1, this.matrix);
    this.drawComponent();
  };

  GameArea.prototype.updateComponent = function () {
    // -1 because canvas starts from 1 but matrix from 0
    this.component.update(this.x, this.x + this.width - 1, this.y + this.height -1 , this.matrix);
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

  GameArea.prototype.checkTetris = function () {
    // mark tetrix states
    let ComCoordlength = this.component.coordinates.length;
    let step = this.component.width;
    let shouldUpdateRest = false;
    // loop through the Ys
    for (let i = 0; i < ComCoordlength; i += step) {
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
        this.score++;
        shouldUpdateRest = true;
        for (let k = 0; k < matrixlength; k++) {
          this.matrix[k][comCoordY] = 2;
        }
      }
    }

    return shouldUpdateRest;
  };

  GameArea.prototype.updateTetris = function () {
    // update the rest of matrix
    let lines = 0;
    let matrixBottom = this.matrix[0].length - 1; // -1 because matrix height starts from 0 not 1
    let matrixLength = this.matrix.length;
    for (let i = matrixBottom; i >= 0; i--) {
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
            // let originalVal = this.matrix[j][i];
            // this.matrix[j][i] = 0;

            // let firstCoordYNotTaken = this.matrix[j][i + lines];
            // if (originalVal === 1) {
            //   while (this.matrix[j][firstCoordYNotTaken] === 0 && firstCoordYNotTaken < this.height - 1 )
            //     firstCoordYNotTaken++;

            //   if (this.matrix[j][firstCoordYNotTaken] === 1)
            //     firstCoordYNotTaken--;
            // }

            // this.matrix[j][firstCoordYNotTaken] = originalVal;
            let originalVal = this.matrix[j][i];
            this.matrix[j][i] = 0;
            this.matrix[j][i + lines] = originalVal;
          }
        }
      }
    }
  };

  GameArea.prototype.redrawMatrix = function () {
    let matrixLength = this.matrix.length;
    let matrixHeight = this.matrix[0].length;
    for (let i = 0; i < matrixLength; i++) {
      for (let j = 0; j < matrixHeight; j++) {
        if (this.matrix[i][j] === 1) {
          this.drawer.fillRect(i, j, 1, 1);
        }
      }
    }
  };

  GameArea.prototype.tetris = function () {
    if (this.checkTetris()) {
      this.updateTetris();
      this.clearCanvas();
      this.redrawMatrix();
    }
  };

  window.GameArea = GameArea || {};
})();