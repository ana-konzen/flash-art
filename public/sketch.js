let indexes = [];

const logoLayer = function (p) {
  brush.instance(p);

  p.afinn;
  p.allData;
  p.palette;
  p.contrast;
  p.sum, p.absSum;
  p.scores = [];
  p.seedNumber = 50;

  p.font;

  p.preload = function () {
    p.afinn = p.loadJSON("afinn.json");
    p.font = p.loadFont("AlteHaasGroteskBold.ttf");
  };
  p.setup = function () {
    p.createCanvas(800, 400, p.WEBGL);
    p.angleMode(p.DEGREES);
    brush.load();
    brush.colorCache(false);
    p.noStroke();
  };

  p.draw = function () {
    p.randomSeed(p.seedNumber);
    brush.seed(p.seedNumber);

    p.noLoop();
    p.background(255);

    drawFlashArt(p);

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
};

const clearCanvas = function (p) {
  brush.instance(p);

  p.font;

  p.preload = function () {
    p.font = p.loadFont("AlteHaasGroteskBold.ttf");
  };
  p.setup = function () {
    p.createCanvas(800, 400, p.WEBGL);
  };

  p.draw = function () {
    p.noLoop();
    p.background(255);
    drawFlashArt(p);
  };
};
