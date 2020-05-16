(function () {
    "use strict";

    function GameConsole(gameArea, gameSpeed, speedX, basicSpeedY, speedYSlow, speedYMax) {
        this.gameArea = gameArea;
        this.gameSpeed = gameSpeed;
        this.basicSpeedY = basicSpeedY;
        this.speedYSlow = speedYSlow;
        this.speedYMax = speedYMax;
        this.speedX = speedX;
        this.level = 1; // game level starts at 0
        this.score = 0;
        this.gameOver = false;
    }

    GameConsole.prototype.start = function () {
        this.gameArea.initCanvas();
        this.gameArea.initComponent(this.getComponentSpeed());
        this.gameArea.drawNextComponent();
        this.interval = setInterval(this.update.bind(this), this.gameSpeed);
    };

    GameConsole.prototype.turnleft = function () {
      let speedY = this.speedYSlow * this.level;
      this.gameArea.changeCompHoriSpeed(-this.speedX, speedY)
    };

    GameConsole.prototype.turnRight = function () {
      let speedY = this.speedYSlow * this.level;
      this.gameArea.changeCompHoriSpeed(this.speedX, speedY)
    };

    GameConsole.prototype.accelerate = function () {
      this.gameArea.changeCompVertSpeed(this.speedYMax)
    };

    GameConsole.prototype.reverSpeed = function () {
      this.gameArea.changeCompHoriSpeed(0); // no speedX by default
      this.gameArea.changeCompVertSpeed(this.getComponentSpeed());
    };

    GameConsole.prototype.transformComponent = function () {
      this.gameArea.transformComponent();
    };

    GameConsole.prototype.toggleStatus = function () {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      } else {
        this.interval = setInterval(this.update.bind(this), this.gameSpeed);
      }
    };

    GameConsole.prototype.getComponentSpeed = function () {
      return Math.min(this.level * this.basicSpeedY, this.speedYMax);
    };

    GameConsole.prototype.updateLevel = function () {
      if (this.score >= 900) {
        this.level = 10;
      } else if (this.score >= 800) {
        this.level = 9;
      } else if (this.score >= 700) {
        this.level = 8;
      } else if (this.score >= 600) {
        this.level = 7;
      } else if (this.score >= 500) {
        this.level = 6;
      } else if (this.score >= 400) {
        this.level = 5;
      } else if (this.score >= 300) {
        this.level = 4;
      } else if (this.score >= 200) {
        this.level = 3;
      } else if (this.score >= 100) {
        this.level = 2;
      }
    };

    GameConsole.prototype.update = function () {
        // Game Over
      if (this.gameOver)
        return;

      this.gameArea.updateLevel(this.level);
      this.gameArea.updateScoreBoard(this.score);

      if (this.gameArea.isComponentDone()) {
        this.gameArea.updateMatrix();

        let tetrix = this.gameArea.tetris();
        if(tetrix){
          this.score += this.gameArea.updateTetris();
          this.updateLevel();
          this.gameArea.clearCanvas();
          this.gameArea.redrawMatrix();
        }    

        // check game status
        this.gameOver = this.gameArea.isGameOver();

        this.gameArea.initComponent(this.getComponentSpeed());
        this.gameArea.drawComponent();
        this.gameArea.drawNextComponent();

        return;
      } 
      
      this.gameArea.eraseComponent();
      this.gameArea.updateComponent()
      this.gameArea.drawComponent();
    };
  
    window.GameConsole = GameConsole || {};
  })();
  