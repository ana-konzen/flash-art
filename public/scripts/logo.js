function getAssets(index, p = p5.instance) {
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
  p.sum = 0;
  p.absSum = 0;
  p.scores = [];
  p.artData = p.allData[index];
  for (const m of p.artData.mood) {
    if (p.afinn[m] === undefined) {
      p.afinn[m] = 0;
    }

    p.scores.push(Number(p.afinn[m]));

    p.sum += Number(p.afinn[m]);
    p.absSum += Math.abs(Number(p.afinn[m]));
  }

  assignAttributes(shapes, p.artData.shape, p);
  assignAttributes(styles, p.artData.style, p);

  p.palette = p.artData.color;
  p.contrast = p.artData.contrast;
}

function assignAttributes(attributes, dataSource, p = p5.instance) {
  for (const attr of attributes) {
    p[attr] = dataSource.includes(attr);
  }
}

function createLayer(p = p5.instance) {
  p.push();
  brush.noField();

  const variance = stddev(p.scores, p);

  const chaosNumber = Math.ceil(variance);

  const myBrushes = setBrushes(p);
  //   p.translate(130, 150);

  setHatch(myBrushes, variance, p);
  setFill(variance, p);
  let brushWidth;
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
  configureField(p);

  drawScribble(chaosNumber, p);
  p.pop();
}

function drawScribble(chaosNumber, p = p5.instance) {
  const numVertex = p.absSum;
  const margin = 50;
  const minX = -p.width / 6 + margin;
  const maxX = p.width / 6 - margin;
  const minY = -p.height / 6 + margin;
  const maxY = p.height / 6 - margin;

  if (
    ((p.rectangular || p.linear || p.sharp) && (p.linear || p.organic || p.sharp)) ||
    (p.geometric && p.linear)
  ) {
    for (let i = 0; i < numVertex; i++) {
      brush.rect(
        p.random(minX, maxX),
        p.random(minY, maxY),
        p.random(10, chaosNumber * numVertex * 5),
        p.random(10, chaosNumber * numVertex * 3)
      );
    }
  } else if (p.circular && p.geometric) {
    for (let i = 0; i < numVertex; i++) {
      brush.circle(
        p.random(minX, maxX),
        p.random(minY, maxY),
        p.random(10, chaosNumber * numVertex * 3),
        true
      );
    }
  } else if (p.rectangular && p.geometric) {
    for (let i = 0; i < numVertex; i++) {
      brush.rect(
        p.random(minX, maxX),
        p.random(minY, maxY),
        p.random(10, chaosNumber * numVertex * 3),
        p.random(10, chaosNumber * numVertex * 3)
      );
    }
  } else if (p.organic && p.sharp) {
    brush.beginShape(0);
    for (let i = 0; i < numVertex; i++) {
      brush.vertex(p.random(minX, maxX), p.random(minY, maxY));
    }
    brush.endShape(p.CLOSE);
  } else {
    brush.beginShape(1);
    for (let i = 0; i < numVertex; i++) {
      brush.vertex(p.random(minX, maxX), p.random(minY, maxY));
    }
    brush.endShape(p.CLOSE);
  }
}

function setBrushes(p = p5.instance) {
  if ((p.radical || p.avantgarde) && !p.classic) {
    return ["pen", "rotring", "marker2"];
  } else if (p.expressionist) {
    return ["marker", "marker2", "hatch_brush", "cpencil"];
  } else if (p.chaotic) {
    return ["rotring", "pen", "HB", "2B", "2H", "hatch_brush"];
  } else {
    return ["rotring", "marker", "marker2", "cpencil", "HB", "2H", "2B"];
  }
}

function configureField(p = p5.instance) {
  if (p.chaotic) {
    setRandomField(p);
  } else if (p.avantgarde || p.maximalist || p.radical || p.expressionist) {
    if (p.minimalist || p.constrained) {
      if (p.random() < 0.3) setRandomField(p);
    } else {
      if (p.random() < 0.7) setRandomField(p);
    }
  } else {
    brush.noField();
  }
}

function setRandomField(p = p5.instance) {
  const randomField = p.random(brush.listFields());
  brush.field(randomField);
}

function setBleed(variance, p = p5.instance) {
  const bleedDirection = variance < 2 ? "in" : "out";

  const bleed = p.map(p.sum, -25, 25, 0, 0.5);

  if ((p.organic && !p.minimalist) || (p.organic && !p.constrained)) {
    brush.bleed(bleed, bleedDirection);
  } else {
    brush.bleed(0);
  }
}

function setFill(variance, p = p5.instance) {
  const opacity = p.contrast === "high" ? 255 : 100;
  brush.fill(p.random(p.palette), opacity);
  setBleed(variance, p);
  if ((p.radical || p.avantgarde) && !p.classic) {
    brush.noFill();
  }
}

function setHatch(myBrushes, variance, p = p5.instance) {
  const hatchAngle = p.map(variance, 0, 25, 0, 180);

  if ((p.radical || p.avantgarde) && !p.classic) {
    brush.setHatch(p.random(myBrushes), p.random(p.palette));
    brush.hatch(p.random(10, 60), hatchAngle);
  } else if (p.expressionist && !p.classic) {
    brush.setHatch(p.random(myBrushes), p.random(p.palette));
    brush.hatch(p.random(10, 60), hatchAngle);
  } else {
    brush.noHatch();
  }
}

function stddev(arr, p = p5.instance) {
  let avg = arr.reduce((acc, c) => acc + c, 0) / arr.length;
  let variance = arr.reduce((acc, c) => acc + (c - avg) ** 2, 0) / arr.length;
  return p.sqrt(variance);
}
