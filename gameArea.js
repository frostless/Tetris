(function () {
  "use strict";

  function GameArea(convasX, convasY, width, height, statusAreaWidth, componentFactory, drawer) {
    this.x = convasX;
    this.y = convasY;
    this.drawer = drawer;
    this.width = width;
    this.height = height;
    this.statusAreaWidth = statusAreaWidth;
    this.componentFactory = componentFactory;
    this.basicLength = width / 10; // the length of the smallest building block
    this.componentNo = -1;
    this.borderColor = 'white';
    this.seperatorColor = '#d3d3d3';

    // coordinates for the game first index; 0 not taken, 1 taken, 2 tetris
    // second index: 0 not border, 1 border
    (() => {
      let matrix = [];
      for (let i = convasX; i < convasX + width; i++) {
        let matrixInner = [];
        for (let j = convasY; j < convasY + height; j++) {
          matrixInner.push([0, 0]);
        }
        matrix.push(matrixInner);
      }
      this.matrix = matrix;
    })();
  }

  GameArea.prototype.initComponent = function () {
    this.componentNo = this.componentNo === -1 ? getRandomInt(0, 6) : this.componentNo;
    let x = this.x + this.width / 2;
    let y = this.y;

    this.component = this.componentFactory.initComponent(this.componentNo, x, y);
  };

  GameArea.prototype.drawNextComponent = function () {
    let textHeight = 140;
    let height = textHeight + 20;
    let x = this.x + this.width + this.statusAreaWidth / 3;
    
    this.drawer.clearRect(
      this.x + this.width + 1,
      this.y + textHeight - 10,
      this.statusAreaWidth,
      this.height
    );
    this.drawer.fillText("Next: ", x, textHeight);

    this.componentNo = getRandomInt(0, 6);

    x = this.x + this.width + this.statusAreaWidth / 2;
    let y = this.y + height;
   
    let component = this.componentFactory.initComponentDrawing(this.componentNo, x, y);

    component.coordinates.forEach((item) => {
      if(item[2] === 0){
        this.drawer.fillRect(item[0], item[1], 1, 1);
      } else{
        this.drawer.fillRect(item[0], item[1], 1, 1, this.borderColor);
      }
    });
  };

  GameArea.prototype.initCanvas = function () {
    this.drawer.initCanvas();
    this.drawSeperator();
  };

  GameArea.prototype.drawSeperator = function () {
    let x = this.x + this.width;
    let y = this.y;
    let width = 1;
    let height = this.y + this.height;
    this.drawer.fillRect(x, y, width, height, this.seperatorColor);
  };

  GameArea.prototype.clearCanvas = function () {
    this.drawer.clearRect(this.x, this.y, this.width, this.height);
  };

  GameArea.prototype.drawComponent = function () {
    this.component.coordinates.forEach((item) => {
      if(item[2] === 0){
        this.drawer.fillRect(item[0], item[1], 1, 1);
      } else{
        this.drawer.fillRect(item[0], item[1], 1, 1, this.borderColor);
      }
    });
  };

  GameArea.prototype.eraseComponent = function () {
    // this.context.fillStyle = this.color;
    this.component.coordinates.forEach((item)=>{
      this.drawer.clearRect(item[0], item[1], 1, 1);
    })
  };

  GameArea.prototype.transformComponent = function () {
    if (this.component.done) return;

    this.eraseComponent();
    // -1 because canvas starts from 1 but matrix from 0
    let boundaryLeft = this.x;
    let boundaryRight = this.x + this.width - 1;
    let bottomY = this.y + this.height - 1;
    this.component.transform(boundaryLeft, boundaryRight, bottomY, this.matrix);
    this.drawComponent();
  };;

  GameArea.prototype.updateComponent = function () {
    let bottomY = this.y + this.height - 1;
    this.component.update(bottomY, this.matrix);
  };

  GameArea.prototype.changeCompHorizontalSpeed = function (speedX) {
    if (this.component.done) return;
    // -1 because canvas starts from 1 but matrix from 0
    let boundaryLeft = this.x;
    let boundaryRight = this.x + this.width - 1;
    this.eraseComponent();
    this.component.changeHorizontalSpeed(speedX, this.matrix, boundaryLeft, boundaryRight)
    this.drawComponent();
  };

  GameArea.prototype.reverseCompHorizontalSpeed = function () {
    this.component.revertHorizontalSpeed();
  };

  GameArea.prototype.updateScoreBoard = function (score) {
    let x = this.x + this.width + this.statusAreaWidth / 3;
    let y = this.y;
    let width = 100;
    let height = 80;
    this.drawer.clearRect(x, height - 10, width, 35);
    this.drawer.fillText('Score: ', x, height);
    this.drawer.fillText(score, x + 10, height + 20);
  };

  GameArea.prototype.updateLevel= function (level) {
    let x = this.x + this.width + this.statusAreaWidth / 3;
    let y = this.y;
    let width = 100;
    let height = 30;
    this.drawer.clearRect(x, height - 10, width, 35);
    this.drawer.fillText('Level: ', x, height);
    this.drawer.fillText(level, x + 10, height + 20);
  };

  GameArea.prototype.isComponentDone = function () {
    return this.component.done;
  };

  GameArea.prototype.isGameOver = function () {
    return this.component.isGameOver(this.y);
  };

  GameArea.prototype.updateMatrix = function () {
    this.component.coordinates.forEach((item) => {
      // 1 means taken
      this.matrix[item[0]][item[1]][0] = 1;
      this.matrix[item[0]][item[1]][1] = item[2];
    });
  };

  GameArea.prototype.checkTetris = function () {
    // mark tetrix states
    let topCoord = this.component.getTopLeftCoord();
    let topCoordY = topCoord[1];
    let lowerBound = topCoordY + this.component.height;
    let shouldUpdateRest = false;
    // loop through the Ys
    for (let i = topCoordY; i < lowerBound; i ++) {
      let matrixlength = this.matrix.length;
      let tetris = true;
      for (let j = 0; j < matrixlength; j++) {
        if (this.matrix[j][i][0] === 0) {
          tetris = false;
          break;
        }
      }

      if (tetris) {
        this.score++;
        shouldUpdateRest = true;
        for (let j = 0; j < matrixlength; j++) {
          this.matrix[j][i][0] = 2;
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
      if (this.matrix[0][i][0] === 2) {
        lines++;
        // update all to 0
        for (let j = 0; j < matrixLength; j++) {
          this.matrix[j][i][0] = 0;
        }
      } else {
        if (lines > 0) {
          // update new pos by lines
          for (let j = 0; j < matrixLength; j++) {
            let originalVal = this.matrix[j][i][0];
            let originalBorder = this.matrix[j][i][1];
            this.matrix[j][i][0] = 0;
            this.matrix[j][i + lines][0] = originalVal;
            this.matrix[j][i + lines][1] = originalBorder;
          }
        }
      }
    }

    let score = lines / this.basicLength * 10;
    return score;
  };

  GameArea.prototype.redrawMatrix = function () {
    let matrixLength = this.matrix.length;
    let matrixHeight = this.matrix[0].length;
    for (let i = 0; i < matrixLength; i++) {
      for (let j = 0; j < matrixHeight; j++) {
        if (this.matrix[i][j][0] === 1) {
          if(this.matrix[i][j][1] === 0){
            this.drawer.fillRect(i, j, 1, 1);
          } else {
            this.drawer.fillRect(i, j, 1, 1, this.borderColor);
          }
        }
      }
    }
  };

  GameArea.prototype.showTetrix = function () {
    let matrixLength = this.matrix.length;
    let matrixHeight = this.matrix[0].length;
    for (let i = 0; i < matrixLength; i++) {
      for (let j = 0; j < matrixHeight; j++) {
        if (this.matrix[i][j][0] === 2) {
          if(this.matrix[i][j][1] === 0) {
            this.drawer.fillRect(i, j, 1, 1);
          } else {
            this.drawer.fillRect(i, j, 1, 1, this.borderColor);
          }
        }
      }
    }
  };

  GameArea.prototype.hideTetrix = function () {
    let matrixLength = this.matrix.length;
    let matrixHeight = this.matrix[0].length;
    for (let i = 0; i < matrixLength; i++) {
      for (let j = 0; j < matrixHeight; j++) {
        if (this.matrix[i][j][0] === 2) {
          this.drawer.clearRect(i, j, 1, 1);
        }
      }
    }
  };

  GameArea.prototype.showTetrixEffects = function (ms) {
    let msEach = ms / 6;
    return new Promise((resolve, reject) => {
      setTimeout(this.hideTetrix.bind(this), msEach);
      setTimeout(this.showTetrix.bind(this), msEach * 2);
      setTimeout(this.hideTetrix.bind(this), msEach * 3);
      setTimeout(this.showTetrix.bind(this), msEach * 4);
      setTimeout(this.hideTetrix.bind(this), msEach * 5);
      setTimeout(() => {
        this.showTetrix();
        resolve();
      }, msEach * 6);
    });
  };

  GameArea.prototype.tetris = function () {
    return this.checkTetris();
  };

  const getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.GameArea = GameArea || {};
})();