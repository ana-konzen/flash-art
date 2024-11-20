const sendElement = document.getElementById("send");
const imageInput = document.getElementById("imageInput");
const loadingBuffer = document.getElementById("loading");
const nameInput = document.getElementById("nameInput");
const saveImage = document.getElementById("saveImage");

const artImg = document.getElementById("artImg");

const randomSeedLabel = document.getElementById("randomSeedLabel");
const randomSeedSlider = document.getElementById("randomSeed");
const randomizeButton = document.getElementById("randomizeSeed");
const logoCheckbox = document.getElementById("logoCheckbox");

let artCanvas;

getArtists();
createMenu();

imageInput.addEventListener("change", () => {
  if (imageInput.files.length === 0) {
    console.log("no image uploaded");
  } else {
    console.log("image uploaded");
  }
});

sendElement.addEventListener("click", async () => {
  if (imageInput.files.length === 0 || nameInput.value === "") {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
    await sendImage();
  }
});

saveImage.onclick = function () {
  saveLogo();
};

randomSeedSlider.value = Math.floor(Math.random() * 9999);
let randomSeed = randomSeedSlider.value;
randomSeedLabel.innerText = `seed: ${randomSeedSlider.value}`;

randomSeedSlider.oninput = function () {
  randomSeed = randomSeedSlider.value;
  randomSeedLabel.innerText = `seed: ${randomSeed}`;
  artCanvas.seedNumber = randomSeed;
  artCanvas.redrawCanvas();
};

randomizeButton.onclick = function () {
  randomSeed = Math.floor(Math.random() * 9999);
  randomSeedSlider.value = randomSeed;
  randomSeedLabel.innerText = `seed: ${randomSeed}`;
  artCanvas.seedNumber = randomSeed;
  artCanvas.redrawCanvas();
};

logoCheckbox.onchange = function () {
  flashArtShowing = !flashArtShowing;
  artCanvas.redrawCanvas();
};

async function sendImage() {
  const reader = new FileReader();
  reader.readAsDataURL(imageInput.files[0]);
  reader.onload = async function () {
    try {
      const loadingMessage = document.getElementById("loadingMessage");
      loadingMessage.style.display = "block";
      console.log("reader loaded");
      const artistName = formatName(nameInput.value);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ image: reader.result, artist: artistName }),
      });

      await getArtists();
    } catch (error) {
      console.error(error);
    }
  };
}

function formatName(name) {
  return name.trim().toLowerCase();
}

async function getArtists() {
  console.log("getting artists");
  const result = await fetch("/api/artists");
  const artists = await result.json();
  indexes = [artists.length - 1];
  createArtistInfo(artists);
  listArtists(artists);
  createGenerator(artists);
  loadingMessage.style.display = "none";
}

function listArtists(artists) {
  const artistList = document.getElementById("artistList");
  artistList.innerHTML = "";
  const lastIndex = indexes[indexes.length - 1];
  artists.forEach((artist, index) => {
    const artistBtn = document.createElement("button");
    artistBtn.classList.add("artistBtn");
    artistBtn.innerHTML = artist.artist;
    artistBtn.classList.add("copy");
    artistList.appendChild(artistBtn);
    if (index === lastIndex) {
      artistBtn.classList.add("selected");
      artCanvas = new p5(logoLayer);
      artCanvas.allData = artists;
      artCanvas.seedNumber = Math.floor(Math.random() * 9999999);
    }
    artistBtn.addEventListener("click", () => {
      const artButtons = document.getElementsByClassName("artistBtn");
      for (const btn of artButtons) {
        btn.classList.remove("selected");
      }
      artistBtn.classList.add("selected");
      indexes = [index];
      artCanvas = new p5(logoLayer);
      artCanvas.allData = artists;
      artCanvas.seedNumber = Math.floor(Math.random() * 9999999);
      createArtistInfo(artists);
    });
  });
}

function createGenerator(artists) {
  const minusCol = document.getElementById("minusCol");
  const plusCol = document.getElementById("plusCol");
  const labelCol = document.getElementById("labelCol");
  labelCol.innerHTML = "";
  minusCol.innerHTML = "";
  plusCol.innerHTML = "";
  artists.forEach((artist, index) => {
    const artistLabel = document.createElement("div");
    artistLabel.innerHTML = artist.artist;
    artistLabel.classList.add("copy");
    labelCol.appendChild(artistLabel);
    const plusButton = document.createElement("button");
    plusButton.innerHTML = "+";
    plusCol.appendChild(plusButton);
    const minusButton = document.createElement("button");
    minusButton.innerHTML = "-";
    minusCol.appendChild(minusButton);
    minusButton.disabled = true;
    minusButton.classList.add("disabled", "minus");

    plusButton.addEventListener("click", () => {
      indexes.push(index);
      artCanvas = new p5(logoLayer);
      artCanvas.allData = artists;
      artCanvas.seedNumber = randomSeed;
      createArtistInfo(artists);
      minusButton.disabled = false;
      minusButton.classList.remove("disabled");
    });

    minusButton.addEventListener("click", () => {
      indexes.splice(indexes.lastIndexOf(index), 1);
      artCanvas = new p5(logoLayer);
      artCanvas.allData = artists;
      artCanvas.seedNumber = randomSeed;
      if (indexes.length > 0) {
        createArtistInfo(artists);
      }
      if (indexes.lastIndexOf(index) === -1) {
        minusButton.disabled = true;
        minusButton.classList.add("disabled");
      }
    });
  });
}

function createArtistInfo(artists) {
  const artist = artists[indexes[indexes.length - 1]];

  const artistName = document.getElementById("artistName");
  const palette = document.getElementById("palette");
  const mood = document.getElementById("mood");
  const styles = document.getElementById("styles");
  const shapes = document.getElementById("shapes");
  const contrast = document.getElementById("contrast");

  artistName.innerText = artist.artist;
  palette.innerHTML = "";
  for (const color of artist.color) {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    palette.appendChild(colorDiv);
  }

  mood.innerHTML = "";
  for (const score of artist.afinn.scores) {
    mood.innerHTML += `${score.mood}: ${score.score}<br>`;
  }
  mood.innerHTML += `&nbsp &nbsp &nbsp sum: ${artist.afinn.sum}`;

  styles.innerHTML = "";
  for (const style of artist.style) {
    styles.innerHTML += `${style}<br>`;
  }

  shapes.innerHTML = "";
  for (const shape of artist.shape) {
    shapes.innerHTML += `${shape}<br>`;
  }

  contrast.innerHTML = artist.contrast;
}

function saveLogo() {
  const imageType = document.getElementById("imageType");
  let selectedType = imageType.value;
  imageType.onchange = function () {
    selectedType = imageType.value;
  };
  const fileName = document.getElementById("fileName");
  artCanvas.saveCanvas(fileName.value, selectedType);
}
