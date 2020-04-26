(function () {
    "use strict";

    function GameConsole(gameArea, gameSpeed) {
        this.gameArea = gameArea;
        this.speed = gameSpeed;
        this.gameOver = false;
    }

    GameConsole.prototype.start = function () {
        this.gameArea.drawCanvas();
        this.interval = setInterval(this.update.bind(this), this.speed);
    };

    GameConsole.prototype.turnleft = function (speedX, speedY) {
      this.gameArea.component.speedX = -speedX;
      this.gameArea.component.speedY = speedY;
    };

    GameConsole.prototype.turnRight = function (speedX,speedY) {
      this.gameArea.component.speedX = speedX;
      this.gameArea.component.speedY = speedY;
    };

    GameConsole.prototype.accelerate = function (speedY) {
      this.gameArea.component.speedY = speedY;
    };

    GameConsole.prototype.reverSpeed = function (speedX, speedY) {
      this.gameArea.component.speedX = speedX;
      this.gameArea.component.speedY = speedY;
    };

    GameConsole.prototype.pause = function () {
      if(this.interval)
      {
        clearInterval(this.interval);
        this.interval = null;
      }
      else
        this.start();
    };

    GameConsole.prototype.update = function () {
        // Game Over
      if (this.gameOver)
        return;

      this.gameArea.updateScoreBoard();

      if (this.gameArea.component.done) {
        this.gameArea.updateMatrix();
        this.gameArea.tetris();

        // check game status
        this.gameOver = this.gameArea.isGameOver();

        this.gameArea.initNewComponent();
        this.gameArea.drawComponent();

        return;
      } 

      this.gameArea.eraseComponent();
      this.gameArea.component.update(
        0,
        0 + this.gameArea.canvas.width,
        this.gameArea.canvas.height,
        this.gameArea.matrix
      );
      this.gameArea.drawComponent();
    };
  
    window.GameConsole = GameConsole || {};
  })();
  