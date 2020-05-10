(function () {
  "use strict";

  function GameArea(convasX, convasY, width, height, drawer, statusAreaWidth) {
    this.x = convasX;
    this.y = convasY;
    this.drawer = drawer;
    this.width = width;
    this.height = height;
    this.statusAreaWidth = statusAreaWidth;
    this.score = 0;
    this.componentNo = -1;

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
    this.componentNo = this.componentNo === -1 ? getRandomInt(0, 6) : this.componentNo;
    let componentFactory = new ComponentFactory(this.x + this.width/2, this.y);

    if(this.componentNo  === 0){
      this.component = componentFactory.initSquareComponent();
    } else if (this.componentNo  === 1){
      this.component = componentFactory.initRectangleComponent();
    }  else if (this.componentNo  === 2){
      this.component = componentFactory.initHalfCrossComponent();
    }  else if (this.componentNo  === 3){
      this.component = componentFactory.initZShapeComponent();
    }  else if (this.componentNo  === 4){
      this.component = componentFactory.initReverseZShapeComponent();
    } else if (this.componentNo  === 5){
      this.component = componentFactory.initLShapeComponent();
    } else if (this.componentNo  === 6){
      this.component = componentFactory.initReverseLShapeComponent();
    } 
  };

  GameArea.prototype.drawNextComponent = function () {
    let textHeight = 80;
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
    let componentFactory = new ComponentFactory(
      this.x + this.width + this.statusAreaWidth / 2,
      this.y + height
    );

    let component;

    // hack for the coord for some components
    // a solution would be to init componeng in a form that could be divided by 15
    // so l shapes comes as little l at first
    if (this.componentNo === 0) {
      component = componentFactory.initSquareComponent();
    } else if (this.componentNo === 1) {
      component = componentFactory.initRectangleComponent();
    } else if (this.componentNo === 2) {
      component = componentFactory.initHalfCrossComponent();
      component.coordinates.forEach((item) => {
        item[0] += 22;
      });
    } else if (this.componentNo === 3) {
      component = componentFactory.initZShapeComponent();
      component.coordinates.forEach((item) => {
        item[0] += 5;
      });
    } else if (this.componentNo === 4) {
      component = componentFactory.initReverseZShapeComponent();
      component.coordinates.forEach((item) => {
        item[0] -= 5;
      });
    } else if (this.componentNo === 5) {
      component = componentFactory.initLShapeComponent();
      component.coordinates.forEach((item) => {
        item[0] += 22;
      });
    } else if (this.componentNo === 6) {
      component = componentFactory.initReverseLShapeComponent();
      component.coordinates.forEach((item) => {
        item[0] += 22;
      });
    }

    component.coordinates.forEach((item) => {
      this.drawer.fillRect(item[0], item[1], 1, 1);
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
    this.drawer.fillRect(x, y, width, height, '#d3d3d3');
  };

  GameArea.prototype.clearCanvas = function () {
    this.drawer.clearRect(this.x, this.y, this.width, this.height);
  };

  GameArea.prototype.drawComponent = function () {
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
    // -1 because canvas starts from 1 but matrix from 0
    let boundaryLeft = this.x;
    let boundaryRight = this.x + this.width - 1;
    let bottomY = this.y + this.height - 1;
    this.component.update(boundaryLeft, boundaryRight, bottomY, this.matrix);
  };

  GameArea.prototype.changeCompHoriSpeed = function (speedX, speedY) {
    this.component.changeHoriSpeed(speedX, speedY)
  };

  GameArea.prototype.changeCompVertSpeed = function (speedY) {
    this.component.changeVertSpeed(speedY)
  };

  GameArea.prototype.updateScoreBoard = function () {
    let x = this.x + this.width + this.statusAreaWidth / 3;
    let y = this.y;
    let width = 100;
    let height = 25;
    this.drawer.clearRect(x, y, width, height + 30);
    this.drawer.fillText('Score: ', x, height);
    this.drawer.fillText(this.score, x + 10, height + 20);
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
      this.matrix[item[0]][item[1]] = 1;
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
        if (this.matrix[j][i] === 0) {
          tetris = false;
          break;
        }
      }

      if (tetris) {
        this.score++;
        shouldUpdateRest = true;
        for (let j = 0; j < matrixlength; j++) {
          this.matrix[j][i] = 2;
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

  const getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.GameArea = GameArea || {};
})();