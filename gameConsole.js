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
        this.gameArea.drawComponent();
        this.gameArea.drawNextComponent();
        this.gameArea.updateLevel(this.level);
        this.gameArea.updateScoreBoard(this.score);
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
      this.level = Math.floor(this.score / 100) + 1;
    };

    GameConsole.prototype.update = async function () {
      // Game Over
      if (this.gameOver)
        return;

      if (this.gameArea.isComponentDone()) {
        this.gameArea.updateMatrix();

        let tetrix = this.gameArea.tetris();
        if (tetrix) {
          clearInterval(this.interval); // wait
          this.interval = null;
          await this.gameArea.showTetrixEffects(600); // wait for effects to finish
          
          this.score += this.gameArea.updateTetris();
          this.updateLevel();
          this.gameArea.clearCanvas();
          this.gameArea.redrawMatrix();
          this.updateGameSpeed();

          this.gameArea.updateLevel(this.level);
          this.gameArea.updateScoreBoard(this.score);

          this.interval = setInterval(this.update.bind(this), this.getGameSpeed());
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
  