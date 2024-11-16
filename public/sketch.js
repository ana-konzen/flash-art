const s = function (p) {
  p.afinn;
  p.artData;
  p.palette;
  p.contrast;
  p.sum, p.absSum;
  p.scores = [];
  p.cnv;

  p.font;

  const shapes = ["circular", "organic", "sharp", "textBool", "linear", "rectangular", "geometric"];

  const styles = [
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
    p.createCanvas(800, 400, p.WEBGL);
    // p.cnv.position(200, 100);

    // p.background(255);
    p.angleMode(p.DEGREES);
    // console.log(p.artData);
    getAssets();
    brush.instance(p);

    brush.load();
    p.noLoop();
  };

  p.draw = function () {
    p.background(255);
    createLayer();
  };

  function getAssets() {
    p.sum = 0;
    p.absSum = 0;
    p.scores = [];
    for (const m of p.artData.mood) {
      if (p.afinn[m] === undefined) {
        p.afinn[m] = 0;
      }

      p.scores.push(Number(p.afinn[m]));

      p.sum += Number(p.afinn[m]);
      p.absSum += Math.abs(Number(p.afinn[m]));
    }

    assignAttributes(shapes, p.artData.shape);
    assignAttributes(styles, p.artData.style);

    p.palette = p.artData.color;
    p.contrast = p.artData.contrast;
  }

  function assignAttributes(attributes, dataSource) {
    for (const attr of attributes) {
      p[attr] = dataSource.includes(attr);
    }
  }

  function setBrushes() {
    if (p.radical || (p.avantgarde && !p.classic)) {
      return ["pen", "rotring", "marker2"];
    } else if (p.expressionist) {
      return ["marker", "marker2", "hatch_brush"];
    } else {
      return ["rotring", "marker", "marker2"];
    }
  }

  function configureField() {
    if (p.chaotic) {
      setRandomField();
    } else if (p.avantgarde || p.maximalist || p.radical || p.expressionist) {
      if (p.minimalist || p.constrained) {
        if (p.random() < 0.3) {
          setRandomField();
        } else {
          brush.noField();
        }
      } else {
        if (p.random() < 0.7) {
          setRandomField();
        } else {
          brush.noField();
        }
      }
    } else {
      brush.noField();
    }
  }

  function setRandomField() {
    const randomField = p.random(brush.listFields());
    console.log(randomField);
    brush.field(randomField);
  }

  function setBleed() {
    const bleedDirection = variance < 2 ? "in" : "out";

    const bleed = p.map(p.sum, -25, 25, 0, 0.5); //see brush.p5 syntax for numbers

    if ((p.organic && !p.minimalist) || (p.organic && !p.constrained)) {
      brush.bleed(bleed, bleedDirection);
    } else {
      brush.bleed(0);
    }
  }

  function createLayer() {
    const numVertex = p.absSum;
    // brush.noField();

    const myBrushes = setBrushes();

    const variance = stddev(p.scores, p);

    const chaosNumber = Math.ceil(variance); //gonna use this for something!

    brush.fill(p.random(p.palette), 140);
    setBleed();

    if (p.radical || (p.avantgarde && !p.classic)) {
      brush.noFill();
      brush.setHatch(p.random(myBrushes), p.random(p.palette));
      const hatchAngle = p.map(variance, 0, 25, 0, 180);
      brush.hatch(p.random(10, 60), hatchAngle);
    } else if (p.expressionist) {
    } else {
      brush.fill(p.random(p.palette), 180);
      brush.noHatch();
    }

    if (p.chaotic) {
      brushWidth = chaosNumber * 4;
    } else if (p.minimalist || p.constrained) {
      brushWidth = chaosNumber;
    } else {
      brushWidth = chaosNumber * 2;
    }

    brush.set(p.random(myBrushes), p.random(p.palette), brushWidth);

    if (p.classic && !p.maximalist && !p.chaotic) {
      brush.noStroke();
    }

    configureField();

    if (p.rectangular && (p.linear || p.textBool || p.organic)) {
      for (i = 0; i < numVertex; i++) {
        brush.rect(
          p.random(p.random(-p.width / 4, p.width / 4)),
          p.random(-p.height / 4, p.height / 4),
          p.random(10, chaosNumber * numVertex * 5),
          p.random(10, chaosNumber * numVertex * 3)
        );
      }
    } else if (p.circular && p.geometric) {
      for (i = 0; i < numVertex; i++) {
        brush.circle(p.random(400), p.random(-50, 100), p.random(10, chaosNumber * numVertex * 3), true);
      }
    } else if (p.rectangular && p.geometric) {
      for (i = 0; i < numVertex; i++) {
        brush.rect(
          p.random(400),
          p.random(-50, 100),
          p.random(10, chaosNumber * numVertex * 3),
          p.random(10, chaosNumber * numVertex * 3)
        );
      }
    } else {
      brush.beginShape(1);
      for (i = 0; i < numVertex; i++) {
        brush.vertex(p.random(-p.width / 4, p.width / 4), p.random(-p.height / 4, p.height / 4));
      }
      brush.endShape(p.CLOSE);
    }
  }

  function stddev(arr) {
    let avg = arr.reduce((acc, c) => acc + c, 0) / arr.length;
    let variance = arr.reduce((acc, c) => acc + (c - avg) ** 2, 0) / arr.length;
    return p.sqrt(variance);
  }

  p.redrawCanvas = function () {
    p.clear();
    p.redraw();
    brush.reDraw();
  };
};
