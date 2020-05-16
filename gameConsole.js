(function () {
    "use strict";

    function GameConsole(gameArea, gameSpeed, maxGameSpeed, speedX) {
        this.gameArea = gameArea;
        this.gameSpeed = gameSpeed;
        this.maxGameSpeed = maxGameSpeed;
        this.speedX = speedX;
        this.level = 1; // game level starts at 0
        this.score = 0;
        this.gameOver = false;
        this.currentGameSpeed = gameSpeed;
    }

    GameConsole.prototype.start = function () {
        this.gameArea.initCanvas();
        this.gameArea.initComponent();
        this.gameArea.drawNextComponent();
        this.interval = setInterval(this.update.bind(this), this.getGameSpeed());
    };

    GameConsole.prototype.turnleft = function () {
      this.gameArea.changeCompHorizontalSpeed(-this.speedX);
      if (this.currentGameSpeed === this.getGameSpeedSlow()) return;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.getGameSpeedSlow());
      }
    };

    GameConsole.prototype.turnRight = function () {
      this.gameArea.changeCompHorizontalSpeed(this.speedX)

      if (this.currentGameSpeed === this.getGameSpeedSlow()) return;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.getGameSpeedSlow());
      }
    };

    GameConsole.prototype.accelerate = function () {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.maxGameSpeed);
      }
    };

    GameConsole.prototype.reverYSpeed = function () {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.getGameSpeed());
      }
    };

    GameConsole.prototype.reverXSpeed = function () {
      this.gameArea.reverseCompHorizontalSpeed();
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.getGameSpeed());
      }
    };

    GameConsole.prototype.transformComponent = function () {
      this.gameArea.transformComponent();
    };

    GameConsole.prototype.toggleStatus = function () {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      } else {
        this.interval = setInterval(this.update.bind(this), this.getGameSpeed());
      }
    };

    GameConsole.prototype.getGameSpeed= function () {
      this.currentGameSpeed = Math.max(this.gameSpeed - this.level * 100, this.maxGameSpeed);
      return this.currentGameSpeed;
    };

    GameConsole.prototype.getGameSpeedSlow= function () {
      this.currentGameSpeed =  Math.max(this.gameSpeed - this.level * 50, this.maxGameSpeed);
      return this.currentGameSpeed;
    };

    GameConsole.prototype.updateGameSpeed = function () {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.getGameSpeed());
      }
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
        if (tetrix) {
          this.score += this.gameArea.updateTetris();
          this.updateLevel();
          this.gameArea.clearCanvas();
          this.gameArea.redrawMatrix();
          this.updateGameSpeed();
        }    

        // check game status
        this.gameOver = this.gameArea.isGameOver();

        this.gameArea.initComponent();
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
  