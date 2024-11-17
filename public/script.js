const sendElement = document.getElementById("send");
const imageInput = document.getElementById("imageInput");
const loadingBuffer = document.getElementById("loading");
const artistFirstName = document.getElementById("artistFirstName");
const artistLastName = document.getElementById("artistLastName");
const artistList = document.getElementById("artistList");

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
      artCanvas = new p5(logoLayer);
      artCanvas.allData = artists;
      artCanvas.seedNumber = 50;
      createArtistInfo(artists);
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

  for (const style of artist.style) {
    styles.innerHTML += `${style}<br>`;
  }

  for (const shape of artist.shape) {
    shapes.innerHTML += `${shape}<br>`;
  }

  contrast.innerHTML = artist.contrast;
}
