(function () {
    "use strict";

    const convasX = 0;
    const convasY = 0;
    const gameAreaW = 270;
    const gameAreaH = 500;
    const speedX = 0;
    const speedY = 5;
    const speedXAcce= 15;
    const speedYAcce = 20;
    const speedYSlow = 1;
    const gameSpeed = 80;
 
    let drawer = new Drawer(gameAreaW, gameAreaH);
    let gameArea = new GameArea(convasX, convasY, gameAreaW, gameAreaH, drawer);
    let gameConsole = new GameConsole(gameArea, gameSpeed);

    document.addEventListener("keydown", (event) => {
      let key = event.which || event.keyCode;
      if (key === 65) {
        gameConsole.turnleft(speedXAcce, speedYSlow);
      } else if (key === 83) {
        gameConsole.accelerate(speedYAcce);
      } else if (key === 68) {
        gameConsole.turnRight(speedXAcce, speedYSlow);
      } else if (key === 74) {
        gameConsole.transformComponent();
      } else if (key === 13) {
        gameConsole.toggleStatus();
      } 
    });

    document.addEventListener("keyup", () => {
      gameConsole.reverSpeed(speedX, speedY);
    });

    gameConsole.start();
  })();