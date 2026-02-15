let currentSketch = null;
const app = document.getElementById("app");
let app_rect = app.getBoundingClientRect();

const PAGES = {
  Home: "home",
};
let current_page = PAGES.Home;

if (current_page == "home") {
  showHome();
}

function showHome() {
  app.innerHTML = `<div id="P5-canvas-container"></div>`;
  const P5CANVASCONTAINER = document.getElementById("P5-canvas-container");
  let P5CANVASCONTAINER_RECT = P5CANVASCONTAINER.getBoundingClientRect();
  mountSketch();
}

function mountSketch() {
  currentSketch = new p5(sketch, "P5-canvas-container");
}

function unmountSketch() {
  if (currentSketch) {
    currentSketch.remove();
    currentSketch = null;
  }
}
