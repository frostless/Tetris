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
    const gameSpeed = 700;
    const maxGameSpeed = 50;
    const statusAreaWidth = gameAreaW / 2;
 
    let drawer = new Drawer(gameAreaW, gameAreaH, statusAreaWidth);
    let componentFactory = new ComponentFactory(basicLength);
    let gameArea = new GameArea(convasX, convasY, gameAreaW, gameAreaH, statusAreaWidth, componentFactory, drawer);
    let gameConsole = new GameConsole(gameArea, gameSpeed, maxGameSpeed, speedX);

    let fired = false;
    document.addEventListener("keydown", function(event){
      let key = event.which || event.keyCode;
      if (key === 65) {
        gameConsole.turnleft();
      } else if (key === 83) {
        if(!fired){
          fired = true;
          gameConsole.accelerate();
        }
      } else if (key === 68) {
        gameConsole.turnRight();
      } else if (key === 74) {
        gameConsole.transformComponent();
      } else if (key === 13) {
        gameConsole.toggleStatus();
      } 
    });

    document.addEventListener("keyup", () => {
      let key = event.which || event.keyCode;
      if (key === 83) {
        fired = false;
        gameConsole.reverYSpeed();
      } else if (key === 65 || key === 68){
        gameConsole.reverXSpeed();
      }
    });

    gameConsole.start();
  })();