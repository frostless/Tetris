(function () {
    "use strict";

    const gameAreaW = 300;
    const gameAreaH = 600;
    const speedX = 0;
    const speedY = 5;
    const speedXAcce= 10;
    const speedYAcce = 15;
    const speedYSlow = 1;
    const gameSpeed = 50;
 
    let gameArea = new GameArea(gameAreaW, gameAreaH);
    let gameConsole = new GameConsole(gameArea, gameSpeed);

    document.addEventListener("keydown", (event) => {
      let key = event.which || event.keyCode;
      if (key === 65) {
        gameConsole.turnleft(speedXAcce, speedYSlow);
      } else if (key === 83) {
        gameConsole.accelerate(speedYAcce);
      } else if (key === 68) {
        gameConsole.turnRight(speedXAcce, speedYSlow);
      } else if (key === 13) {
        gameConsole.pause();
      }
    });

    document.addEventListener("keyup", () => {
      gameConsole.reverSpeed(speedX, speedY);
    });

    gameConsole.start();
  })();