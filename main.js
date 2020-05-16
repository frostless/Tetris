(function () {
    "use strict";

    const convasX = 0;
    const convasY = 0;
    // needs to be divided by 10
    const gameAreaW = 300;
    // height is 2 times of width
    const gameAreaH = 600;
    const speedX = gameAreaW / 10; // the smallest length of a component
    const basicLength = gameAreaW / 10; // the smallest length of a component
    const basicSpeedY = 5;
    const speedYSlow = 1;
    const speedYMax = 50
    const gameSpeed = 80;
    const statusAreaWidth = gameAreaW / 2;
 
    let drawer = new Drawer(gameAreaW, gameAreaH, statusAreaWidth);
    let componentFactory = new ComponentFactory(basicLength);
    let gameArea = new GameArea(convasX, convasY, gameAreaW, gameAreaH, statusAreaWidth, componentFactory, drawer);
    let gameConsole = new GameConsole(gameArea, gameSpeed, speedX, basicSpeedY, speedYSlow, speedYMax);

    document.addEventListener("keydown", (event) => {
      let key = event.which || event.keyCode;
      if (key === 65) {
        gameConsole.turnleft();
      } else if (key === 83) {
        gameConsole.accelerate();
      } else if (key === 68) {
        gameConsole.turnRight();
      } else if (key === 74) {
        gameConsole.transformComponent();
      } else if (key === 13) {
        gameConsole.toggleStatus();
      } 
    });

    document.addEventListener("keyup", () => {
      gameConsole.reverSpeed();
    });

    gameConsole.start();
  })();