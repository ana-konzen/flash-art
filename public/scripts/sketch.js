let indexes = [];
let flashArtShowing = true;

const logoLayer = function (p) {
  brush.instance(p);

  p.afinn;
  p.allData;
  p.palette;
  p.contrast;
  p.sum, p.absSum;
  p.scores = [];
  p.seedNumber = 50;

  p.logo;

  p.preload = function () {
    p.afinn = p.loadJSON("assets/afinn.json");
    p.logo = p.loadImage("assets/logo.png");
  };
  p.setup = function () {
    p.createCanvas(900, 600, p.WEBGL);
    p.angleMode(p.DEGREES);
    // p.imageMode(p.CENTER);

    brush.load();
    // brush.colorCache(false);
    p.noStroke();
  };

  p.draw = function () {
    p.noLoop();

    p.randomSeed(p.seedNumber);
    brush.seed(p.seedNumber);

    p.background(255);

    if (flashArtShowing) {
      p.image(p.logo, -p.width / 5, -p.height / 7, p.logo.width / 6, p.logo.height / 6);
    }

    for (const index of indexes) {
      getAssets(index, p);
      p.push();
      brush.push();
      p.noFill();
      createLayer(p);
      brush.pop();
      p.pop();
    }
  };

  p.redrawCanvas = function () {
    p.redraw();
    brush.reDraw();
  };
};

const clearCanvas = function (p) {
  brush.instance(p);
  p.logo;

  p.preload = function () {
    p.logo = p.loadImage("assets/logo.png");
  };
  p.setup = function () {
    p.createCanvas(900, 600, p.WEBGL);
  };

  p.draw = function () {
    p.noLoop();
    p.background(255);
    if (flashArtShowing) {
      p.image(p.logo, -p.width / 5, -p.height / 7, p.logo.width / 6, p.logo.height / 6);
    }
  };
};
