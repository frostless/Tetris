(function () {
    "use strict";

    function GameConsole(gameArea, gameSpeed) {
        this.gameArea = gameArea;
        this.speed = gameSpeed;
        this.gameOver = false;
    }

    GameConsole.prototype.start = function () {
        this.gameArea.initCanvas();
        this.gameArea.initComponent();
        this.interval = setInterval(this.update.bind(this), this.speed);
    };

    GameConsole.prototype.turnleft = function (speedX, speedY) {
      this.gameArea.changeCompHoriSpeed(-speedX, speedY)
    };

    GameConsole.prototype.turnRight = function (speedX,speedY) {
      this.gameArea.changeCompHoriSpeed(speedX, speedY)
    };

    GameConsole.prototype.accelerate = function (speedY) {
      this.gameArea.changeCompVertSpeed(speedY)
    };

    GameConsole.prototype.reverSpeed = function (speedX, speedY) {
      this.gameArea.changeCompHoriSpeed(speedX)
      this.gameArea.changeCompVertSpeed(speedY)
    };

    GameConsole.prototype.transformComponent = function () {
      this.gameArea.transformComponent();
    };

    GameConsole.prototype.toggleStatus = function () {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      } else {
        this.interval = setInterval(this.update.bind(this), this.speed);
      }
    };

    GameConsole.prototype.update = function () {
        // Game Over
      if (this.gameOver)
        return;

      this.gameArea.updateScoreBoard();

      if (this.gameArea.isComponentDone()) {
        this.gameArea.updateMatrix();
        this.gameArea.tetris();

        // check game status
        this.gameOver = this.gameArea.isGameOver();

        this.gameArea.initComponent();
        this.gameArea.drawComponent();

        return;
      } 

      this.gameArea.eraseComponent();
      this.gameArea.updateComponent()
      this.gameArea.drawComponent();
    };
  
    window.GameConsole = GameConsole || {};
  })();
  