const BASE_URL = "http://localhost:3000";
const PICTURES_URL = `${BASE_URL}/pictures`

let image;

document.addEventListener("DOMContentLoaded", function() {
  //loadMeme();
});

function getData() {
  return fetch(`${PICTURES_URL}/2`)
  .then(resp => resp.json())
}

function loadMeme() {
  let memeSpace = document.getElementById("content");
  let imgDiv = document.createElement("div");
  imgDiv.setAttribute("class", "img");
  let meme = document.createElement("img");
  fetch(`${PICTURES_URL}/2`)
    .then(resp => resp.json())
    .then(json => {
      meme.setAttribute("src", `${json.link}`);
    });
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Get outta here!";
  deleteButton.setAttribute("class", "btn btn-primary");
  deleteButton.addEventListener("click", e => {
    deleteMeme();
  });
  memeSpace.style.textAlign = "center";
  memeSpace.setAttribute("class", "meme-space");
  imgDiv.appendChild(meme);
  memeSpace.appendChild(imgDiv);
  memeSpace.appendChild(deleteButton);
}

function deleteMeme() {
  let memeSpace = document.getElementById("content");
  while(memeSpace.firstChild) {
    memeSpace.removeChild(memeSpace.firstChild);
  }
  memeSpace.removeAttribute("class");
}