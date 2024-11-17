const sendElement = document.getElementById("send");
const imageInput = document.getElementById("imageInput");
const loadingBuffer = document.getElementById("loading");
const artistFirstName = document.getElementById("artistFirstName");
const artistLastName = document.getElementById("artistLastName");
const artistList = document.getElementById("artistList");

const artImg = document.getElementById("artImg");
const fileLabel = document.getElementById("fileLabel");

// const indexes = [];
let artCanvas;

getArtists();

// const artCanvas = new p5(s);

imageInput.addEventListener("change", () => {
  if (imageInput.files.length === 0) {
    console.log("No image uploaded");
    fileLabel.style.background = "red";
    fileLabel.innerHTML = "error";
  } else {
    console.log("Image uploaded");
    fileLabel.style.background = "green";
    fileLabel.innerHTML = "uploaded";
  }
});

sendElement.addEventListener("click", async () => {
  artImg.src = "";
  loadingBuffer.style.display = "block";

  if (imageInput.files.length === 0) {
    console.log("No image uploaded");
  } else {
    await sendImage();
  }
});

async function sendImage() {
  const reader = new FileReader();
  reader.readAsDataURL(imageInput.files[0]);
  reader.onload = async function () {
    try {
      console.log("reader loaded");
      console.log(reader.result.slice(0, 50));
      const artistName =
        artistFirstName.value.toLowerCase().trim() + " " + artistLastName.value.toLowerCase().trim();
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ image: reader.result, artist: artistName }),
      });
      const artData = await response.json();
      // artImg.src = reader.result;
      // infoCont.innerHTML = artData[0].query;
      console.log(artData);

      fileLabel.style.background = "black";
      fileLabel.innerHTML = "choose file";
      loadingBuffer.style.display = "none";
      // const artCanvas = new p5(s);
      // artCanvas.allData = artData;
      await getArtists();
    } catch (error) {
      console.error(error);
    }
  };
}

async function getArtists() {
  console.log("getting artists");
  const result = await fetch("/api/artists");
  const artists = await result.json();
  console.log(artists);
  createArtistInfo(artists[artists.length - 1]);
  // artCanvas.artData = artists[artists.length - 1];
  listArtists(artists);
}

function listArtists(artists) {
  artistList.innerHTML = "";
  artists.forEach((artist, index) => {
    const artistBtn = document.createElement("button");
    artistBtn.innerHTML = artist.artist;
    artistBtn.classList.add("copy");
    artistList.appendChild(artistBtn);
    artistBtn.addEventListener("click", () => {
      indexes.push(index);
      artCanvas = new p5(s);
      artCanvas.allData = artists;
      artCanvas.seedNumber = 50;

      // artCanvas.artData = artist;

      // artCanvas.redrawCanvas();
      createArtistInfo(artist);
    });
  });
}

function createArtistInfo(artist) {
  const artistInfo = document.getElementById("artistInfo");
  artistInfo.innerHTML = `<p class="artist">${artist.artist}</p><p>color</p>`;
  const colorPalette = document.createElement("div");
  colorPalette.classList.add("colorPalette");
  for (const color of artist.color) {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorPalette.appendChild(colorDiv);
  }
  artistInfo.appendChild(colorPalette);
  artistInfo.innerHTML += `<p>sentiment analysis</p>`;
  const sentimentAnalysis = document.createElement("div");
  sentimentAnalysis.classList.add("sentimentAnalysis");
  for (const score of artist.afinn.scores) {
    sentimentAnalysis.innerHTML += `<p>${score.mood}: ${score.score}</p>`;
  }
  sentimentAnalysis.innerHTML += `<p class="sum">sum: ${artist.afinn.sum}</p>`;
  artistInfo.appendChild(sentimentAnalysis);
  artistInfo.innerHTML += `<p>style: ${artist.style[0]}, ${artist.style[1]}</p>`;
  artistInfo.innerHTML += `<p>shape: ${artist.shape[0]}, ${artist.shape[1]}</p>`;
  artistInfo.innerHTML += `<p>contrast: ${artist.contrast}</p>`;
}
