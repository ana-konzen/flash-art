const sendElement = document.getElementById("send");
const imageInput = document.getElementById("imageInput");
const loadingBuffer = document.getElementById("loading");
const artistFirstName = document.getElementById("artistFirstName");
const artistLastName = document.getElementById("artistLastName");

const artImg = document.getElementById("artImg");
const fileLabel = document.getElementById("fileLabel");

let artCanvas;

getArtists();
createMenu();

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
      console.log(artData);

      fileLabel.style.background = "black";
      fileLabel.innerHTML = "choose file";
      loadingBuffer.style.display = "none";

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
  indexes = [artists.length - 1];
  createArtistInfo(artists);
  listArtists(artists);
  createGenerator(artists);
}

function listArtists(artists) {
  const artistList = document.getElementById("artistList");
  artistList.innerHTML = "";
  artists.forEach((artist, index) => {
    const artistBtn = document.createElement("button");
    artistBtn.innerHTML = artist.artist;
    artistBtn.classList.add("copy");
    artistList.appendChild(artistBtn);
    artistBtn.addEventListener("click", () => {
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
      artCanvas.seedNumber = 50;
      createArtistInfo(artists);
      minusButton.disabled = false;
      minusButton.classList.remove("disabled");
    });

    minusButton.addEventListener("click", () => {
      indexes.pop();
      artCanvas = new p5(logoLayer);
      artCanvas.allData = artists;
      artCanvas.seedNumber = 50;
      if (indexes.length > 0) {
        createArtistInfo(artists);
      }
      if (indexes.length < 1) {
        minusButton.disabled = true;
        minusButton.classList.add("disabled");
      }
    });
  });
}

function createArtistInfo(artists) {
  const artist = artists[indexes[indexes.length - 1]];
  console.log(artist);

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
