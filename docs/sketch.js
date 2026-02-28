const sketch = (p) => {
  // State variables
  let states = {
    HOME: "home",
    PLAYING: "playing",
  };
  let currentState = states.HOME;
  let previousState = undefined;
  let initialize = true;
  let debug = false;

  let playButton = undefined;
  let paddle = undefined;

  p.setup = function () {
    p.canvas = p.createCanvas(300, 600);
    p.canvas.position(
      p.canvas.parent().getBoundingClientRect().width / 2 - p.canvas.width / 2,
      p.canvas.parent().getBoundingClientRect().height / 2 -
        p.canvas.height / 2,
    );
  };

  p.draw = function () {
    p.background(30);
    p.fill(100);
    p.circle(p.mouseX, p.mouseY, 50);

    window.onresize = updateCanvasPosition();

    if (previousState != currentState) {
      initialize = true;
    }

    // Run state functions based on currentState
    if (currentState == states.HOME) {
      showStartScreen();
    } else if (currentState == states.PLAYING) {
      game();
    }

    previousState = currentState;

    // Debug
    if (debug) {
      console.log(p.canvas);
      console.log(document.getElementById("P5-canvas-container"));
    }
  };

  p.mousePressed = function () {
    if (playButton.hovered) {
      currentState = states.PLAYING;
    }
  };

  // Auto place canvas when window dimensions change
  function updateCanvasPosition() {
    p.canvas.position(
      p.canvas.parent().getBoundingClientRect().width / 2 - p.canvas.width / 2,
      p.canvas.parent().getBoundingClientRect().height / 2 -
        p.canvas.height / 2,
    );
  }

  // Pre-game start screen
  function showStartScreen() {
    if (initialize) {
      playButton = new PlayButton(
        [0, 200, 0],
        p.canvas.width / 2,
        p.canvas.height / 2,
        200,
        [255, 255, 255],
      );
      playButton.draw();
      playButton.checkForMouse();

      paddle = new Paddle(
        [120, 120, 120],
        p.canvas.width / 2,
        p.canvas.height / 1.05,
        50,
        20,
      );
      paddle.draw();
    } else {
      playButton.draw();
      playButton.checkForMouse();

      paddle.draw();
    }
  }

  // Game
  function game() {
    paddle.draw();
    paddle.xpos = p.mouseX;
  }

  class CircleButton {
    constructor(buttonRBGList, xpos, ypos, diameter) {
      this.buttonRBGList = buttonRBGList;
      this.xpos = xpos;
      this.ypos = ypos;
      this.diameter = diameter;
      this.radius = diameter / 2;
    }

    draw() {
      p.fill(
        this.buttonRBGList[0],
        this.buttonRBGList[1],
        this.buttonRBGList[2],
      );
      p.circle(this.xpos, this.ypos, this.diameter);
    }
  }

  class PlayButton extends CircleButton {
    constructor(buttonRBGList, xpos, ypos, diameter, triangleRBGList) {
      // super uses parent's constructor
      super(buttonRBGList, xpos, ypos, diameter);
      this.triangleRBGList = triangleRBGList;
      this.trianglex1 = this.xpos - this.diameter / 5;
      this.triangley1 = this.ypos - this.diameter / 3.5;
      this.trianglex2 = this.xpos - this.diameter / 5;
      this.triangley2 = this.ypos + this.diameter / 3.5;
      this.trianglex3 = this.xpos + this.diameter / 4;
      this.triangley3 = this.ypos;
      this.hovered = false;
    }

    draw() {
      // Sets color and makes button circle
      p.fill(
        this.buttonRBGList[0],
        this.buttonRBGList[1],
        this.buttonRBGList[2],
      );
      p.circle(this.xpos, this.ypos, this.diameter);

      // Sets color and makes the triangle on the button circle
      p.fill(
        this.triangleRBGList[0],
        this.triangleRBGList[1],
        this.triangleRBGList[2],
      );
      p.triangle(
        this.trianglex1,
        this.triangley1,
        this.trianglex2,
        this.triangley2,
        this.trianglex3,
        this.triangley3,
      );
    }

    checkForMouse() {
      if (
        p.abs(p.dist(p.mouseX, p.mouseY, this.xpos, this.ypos)) < this.radius
      ) {
        this.hovered = true;
      } else {
        this.hovered = false;
      }
    }
  }

  class Paddle {
    constructor(paddleRGBList, xpos, ypos, width, height) {
      this.RGBList = paddleRGBList;
      this.xpos = xpos;
      this.ypos = ypos;
      this.width = width;
      this.height = height;
    }

    draw() {
      p.fill(this.RGBList[0], this.RGBList[1], this.RGBList[2]);

      p.rectMode(p.CENTER);
      p.rect(this.xpos, this.ypos, this.width, this.height);
    }
  }
};
