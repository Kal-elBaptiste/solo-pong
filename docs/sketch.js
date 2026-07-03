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

  // Interactable game objects
  let playButton = undefined;
  let paddle = undefined;
  let ball = undefined;

  // Score variables
  let score = 0;

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

    window.onresize = updateCanvasPosition();

    // Helps with setting up objects during state changes
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
      // Play Button
      playButton = new PlayButton(
        [0, 200, 0],
        p.canvas.width / 2,
        p.canvas.height / 2,
        200,
        [255, 255, 255],
      );
      playButton.draw();
      playButton.checkForMouse();

      // Paddle
      paddle = new Paddle(
        [255, 255, 255],
        p.canvas.width / 2,
        p.canvas.height / 1.05,
        75,
        20,
      );
      paddle.draw(0, p.canvas.width);

      // Ball
      ball = new Ball(
        [255, 0, 0],
        p.canvas.width / 2,
        paddle.ypos - 25,
        25,
        5,
        -5,
      );
      ball.draw();
    } else {
      playButton.draw();
      playButton.checkForMouse();

      paddle.draw();
    }
  }

  // Displays Score Counter
  function displayScore(score, xpos, ypos, textSize) {
    p.textAlign(p.CENTER);
    p.textSize(textSize);
    p.text(score, xpos, ypos);
  }

  // Game
  function game() {
    // Continue to draw paddle + move it
    paddle.draw();
    paddle.move(0, p.canvas.width);

    // Continue to draw ball + move it
    ball.draw();
    ball.move(0, p.canvas.width, 0, p.canvas.height);
    ball.detectRectTopCollision(paddle);
    ball.increaseSpeedBasedOnBounces(5, 2);

    // Display score
    displayScore(
      ball.specialbounces,
      p.canvas.width / 2,
      p.canvas.height / 2,
      100,
    );

    // Restart game upon loss
    if (ball.ypos + ball.radius > paddle.ypos - paddle.height / 2) {
      currentState = states.HOME;
    }
  }

  // Classes
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
      // set color
      p.fill(this.RGBList[0], this.RGBList[1], this.RGBList[2]);

      // place paddle
      p.rectMode(p.CENTER);
      p.rect(this.xpos, this.ypos, this.width, this.height);
    }

    move(xbound1, xbound2) {
      // move paddle
      this.xpos = p.mouseX;
      console.log(this.xpos);

      // keep paddle within bounds
      if (this.xpos - this.width / 2 < xbound1) {
        this.xpos = xbound1 + this.width / 2;
      }
      if (this.xpos + this.width / 2 > xbound2) {
        this.xpos = xbound2 - this.width / 2;
      }
    }
  }

  class Ball {
    constructor(ballRGBList, xpos, ypos, diameter, xvelocity, yvelocity) {
      this.RGBList = ballRGBList;
      this.xpos = xpos;
      this.ypos = ypos;
      this.diameter = diameter;
      this.radius = diameter / 2;
      this.xvelocity = xvelocity;
      this.yvelocity = yvelocity;
      this.specialbounces = 0;
    }

    draw() {
      p.fill(this.RGBList[0], this.RGBList[1], this.RGBList[2]);
      p.circle(this.xpos, this.ypos, this.diameter);
    }

    move(xbound1, xbound2, ybound1, ybound2) {
      this.xpos += this.xvelocity;
      this.ypos += this.yvelocity;

      // Keeps ball within x boundaries
      if (
        this.xpos - this.radius < xbound1 ||
        this.xpos + this.radius > xbound2
      ) {
        // undo movement + flip x velocity sign
        this.xpos -= this.xvelocity;
        this.xvelocity = -this.xvelocity;
      }

      // Keeps ball within y boundaries
      if (
        this.ypos - this.radius < ybound1 ||
        this.ypos + this.radius > ybound2
      ) {
        // undo movement + flip y velocity sign
        this.ypos -= this.yvelocity;
        this.yvelocity = -this.yvelocity;
      }
    }

    // assumes rectMode is set to CENTER
    detectRectTopCollision(rect) {
      // deliver rect's corner coordinates
      let rectleft = rect.xpos - rect.width / 2;
      let rectright = rect.xpos + rect.width / 2;
      let recttop = rect.ypos - rect.height / 2;

      // if circle collides with the rect's top
      if (
        this.xpos > rectleft &&
        this.xpos < rectright &&
        recttop - this.ypos <= this.radius
      ) {
        this.ypos -= this.yvelocity;
        this.yvelocity = -this.yvelocity;
        this.specialbounces += 1;
      }
    }

    increaseSpeedBasedOnBounces(bouncesNeeded, speedInc) {
      // Checks for multiples of bouncesNeeded and increases speed accordingly
      if (
        Number.isInteger(this.specialbounces / bouncesNeeded) &&
        this.specialbounces / bouncesNeeded > 0
      ) {
        this.xvelocity = 5 + (this.specialbounces / bouncesNeeded) * speedInc;
        this.yvelocity = 5 + (this.specialbounces / bouncesNeeded) * speedInc;
      }

      //debug
      console.log(
        "Special bounces & special bounces needed:",
        this.specialbounces % bouncesNeeded,
      );
      console.log("Ball xvelocity:", this.xvelocity);
    }
  }
};
