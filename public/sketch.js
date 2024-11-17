let indexes = [];

const s = function (p) {
  p.afinn;
  p.allData;
  p.palette;
  p.contrast;
  p.sum, p.absSum;
  p.scores = [];
  p.seedNumber = 50;

  p.cnv;
  brush.instance(p);

  p.font;

  p.shapes = ["circular", "organic", "sharp", "textBool", "linear", "rectangular", "geometric"];

  p.styles = [
    "avantgarde",
    "radical",
    "minimalist",
    "constrained",
    "classic",
    "expressionist",
    "maximalist",
    "chaotic",
  ];

  p.preload = function () {
    p.afinn = p.loadJSON("afinn.json");
    p.font = p.loadFont("AlteHaasGroteskBold.ttf");
  };
  p.setup = function () {
    p.cnv = p.createCanvas(1400, 800, p.WEBGL);
    positionCanvas(p);

    // p.cnv.position(200, 100);

    // p.background(255);
    p.angleMode(p.DEGREES);
    // console.log(p.artData);

    brush.load();
  };

  p.draw = function () {
    p.randomSeed(p.seedNumber);

    p.noLoop();
    p.translate(-p.width / 2, -p.height / 2 + 100);
    p.background(255);

    for (const index of indexes) {
      getAssets(index, p);
      p.push();
      brush.push();
      p.noStroke();
      p.noFill();
      createLayer(p);
      brush.pop();
      p.pop();
    }
  };

  p.redrawCanvas = function () {
    p.clear();
    p.redraw();
    brush.reDraw();
  };
};

function positionCanvas(p = p5.instance) {
  let x = p.windowWidth / 2 - p.width / 2;
  let y = 50;
  p.cnv.position(500, y);
}
