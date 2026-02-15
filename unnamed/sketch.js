const sketch = (p) => {
  p.setup = function () {
    p.canvas = p.createCanvas(400, 400);
    p.canvas.position(
      p.canvas.parent().getBoundingClientRect().width / 2 - p.canvas.width / 2,
      p.canvas.parent().getBoundingClientRect().height / 2 +
        p.canvas.height / 2,
    );
  };

  p.draw = function () {
    p.background(30);
    p.fill(255);
    p.circle(p.mouseX, p.mouseY, 50);

    window.onresize = updateCanvasPosition();
  };

  function updateCanvasPosition() {
    p.canvas.position(
      p.canvas.parent().getBoundingClientRect().width / 2 - p.canvas.width / 2,
      p.canvas.parent().getBoundingClientRect().height / 2 -
        p.canvas.height / 2,
    );
  }
};
