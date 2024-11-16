const s = function (p) {
  p.afinn;
  p.allData;
  p.palette;
  p.contrast;
  p.sum, p.absSum;
  p.afinnObj;
  p.scores = [];
  p.font;
  p.circular, p.organic, p.sharp, p.textBool, p.linear, p.rectangular, p.geometric;
  p.avantgarde, p.radical, p.minimalist, p.constrained, p.classic, p.expressionist, p.maximalist, p.chaotic;

  p.preload = function () {
    p.afinn = p.loadJSON("afinn.json");
    p.font = p.loadFont("AlteHaasGroteskBold.ttf");
  };
  p.setup = function () {
    p.createCanvas(1400, 800, p.WEBGL);
    // p.background(255);
    p.angleMode(p.DEGREES);
    console.log(p.allData);
    brush.instance(p);

    brush.load();
    p.noLoop();
    getAssets();
  };

  p.draw = function () {
    p.translate(-p.width / 2, -p.height / 2 + 50);
    p.fill(0);

    p.textFont(p.font);

    p.push();

    p.textSize(100);
    p.text("flash art", 130, 200);

    p.pop();

    p.push();
    p.noStroke();
    p.noFill();
    // createLayer();
    p.pop();
  };

  function getAssets() {
    p.sum = 0;
    p.absSum = 0;
    p.scores = [];
    for (const m of p.allData.mood) {
      if (p.afinn[m] === undefined) {
        p.afinn[m] = 0;
      }
      console.log(m + ":" + p.afinn[m]);

      p.scores.push(Number(p.afinn[m]));

      p.sum += Number(p.afinn[m]);
      p.absSum += Math.abs(Number(p.afinn[m]));
    }
    p.afinnObj = {
      sum: p.sum,
      absSum: p.absSum,
      scores: p.scores,
    };
    p.circular = p.allData.shape.includes("circular");
    p.organic = p.allData.shape.includes("organic");
    p.sharp = p.allData.shape.includes("sharp");
    p.textBool = p.allData.shape.includes("text");
    p.linear = p.allData.shape.includes("linear");
    p.rectangular = p.allData.shape.includes("rectangular");
    p.geometric = p.allData.shape.includes("geometric");

    p.avantgarde = p.allData.style.includes("avant-garde");
    p.radical = p.allData.style.includes("radical");
    p.minimalist = p.allData.style.includes("minimalist");
    p.constrained = p.allData.style.includes("constrained");
    p.classic = p.allData.style.includes("classic");
    p.expressionist = p.allData.style.includes("expressionist");
    p.maximalist = p.allData.style.includes("maximalist");
    p.chaotic = p.allData.style.includes("chaotic");

    p.palette = p.allData.color;
    p.contrast = p.allData.contrast;
  }

  function createLayer() {
    p.push();

    const numVertex = p.absSum;

    const radBrushes = ["pen", "rotring", "marker2"];
    const expBrushes = ["marker", "marker2", "hatch_brush"];

    let myBrushes = ["rotring", "marker", "marker2"]; //this array will be defined by the style;

    let chaosLevel;

    const variance = stddev(p.scores, p);

    const myAngle = p.map(variance, 0, 25, 0, 180);

    const chaosNumber = Math.ceil(variance); //gonna use this for something!

    brush.noField();

    if (variance < 2) {
      chaosLevel = "in";
      // brush.noStroke();
    } else {
      chaosLevel = "out";
    }

    const bleed = p.map(p.sum, -25, 25, 0, 0.5); //see brush.p5 syntax for numbers
    console.log(bleed);
    p.translate(130, 150);

    brush.fill(p.random(p.palette), 140);

    console.log(p.organic, p.minimalist, p.constrained);
    if ((p.organic && !p.minimalist) || (p.organic && !p.constrained)) {
      brush.bleed(bleed, chaosLevel);
    } else {
      brush.bleed(0);
    }

    //  console.log(chaosNumber * numVertex);

    if (p.radical || (p.avantgarde && !p.classic)) {
      brush.noFill();
      myBrushes = radBrushes;
      brush.setHatch(p.random(myBrushes), p.random(p.palette));
      brush.hatch(p.random(10, 60), myAngle);
    } else if (p.expressionist) {
      myBrushes = expBrushes;
    } else {
      brush.fill(p.random(p.palette), 140);
      myBrushes = ["rotring", "marker", "marker2"];
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
    console.log(chaosNumber);

    if (p.classic && !p.maximalist && !p.chaotic) {
      brush.noStroke();
      console.log("test");
      console.log(p.classic, p.maximalist, p.chaotic);
    }

    if (p.chaotic) {
      brush.field(p.random(brush.listFields()));
    } else if (p.avantgarde || p.maximalist || p.radical || p.expressionist) {
      if (p.minimalist || p.constrained) {
        if (p.random() < 0.3) {
          brush.field(p.random(brush.listFields()));
        }
      } else {
        if (p.random() < 0.7) {
          brush.field(p.random(brush.listFields()));
        }
      }
    } else if (p.minimalist || p.constrained) {
      brush.noField();
    } else {
      brush.noField();
    }

    //defining the shape below
    switch (
      1e6 * p.rectangular +
      1e5 * p.circular +
      1e4 * p.organic +
      1e3 * p.sharp +
      1e2 * p.textBool +
      1e1 * p.linear +
      1 * p.geometric
    ) {
      case 110000:
        brush.beginShape(1);
        for (i = 0; i < numVertex; i++) {
          brush.vertex(p.random(400), p.random(-50, 100));
        }
        brush.endShape();

        // brush.circle(p.random(400), p.random(-50, 100), 50);

        // console.log(1e7*rectangular+1e6*circular+1e5*organic+1e4*sharp+1e3*textBool+1e2*linear+1*geometric)

        break;
      case 1000100:
        for (i = 0; i < numVertex; i++) {
          brush.rect(
            p.random(400),
            p.random(-50, 100),
            p.random(10, chaosNumber * numVertex * 5),
            p.random(10, chaosNumber * numVertex * 3)
          );
        }

        break;

      case 100001:
        for (i = 0; i < numVertex; i++) {
          brush.circle(p.random(400), p.random(-50, 100), p.random(10, chaosNumber * numVertex * 3), true);
        }

        break;

      case 1000001:
        for (i = 0; i < numVertex; i++) {
          brush.rect(
            p.random(400),
            p.random(-50, 100),
            p.random(10, chaosNumber * numVertex * 3),
            p.random(10, chaosNumber * numVertex * 3)
          );
        }

        break;

      case 100001:
        brush.beginShape(1);
        for (i = 0; i < numVertex; i++) {
          brush.vertex(p.random(400), p.random(-50, 100));
        }
        brush.endShape(CLOSE);

        break;

      default:
        // brush.rect(10, 10, 50, 50);

        brush.beginShape(1);
        for (i = 0; i < numVertex; i++) {
          brush.vertex(p.random(400), p.random(-50, 100));
        }
        brush.endShape(p.CLOSE);

        break;
    }

    p.pop();
  }

  function stddev(arr) {
    let avg = arr.reduce((acc, c) => acc + c, 0) / arr.length;
    let variance = arr.reduce((acc, c) => acc + (c - avg) ** 2, 0) / arr.length;
    return p.sqrt(variance);
  }
};
