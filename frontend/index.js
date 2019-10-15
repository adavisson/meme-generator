const BASE_URL = "http://localhost:3000";
const PICTURES_URL = `${BASE_URL}/pictures`;

//document.addEventListener("DOMContentLoaded", function() {
//  //loadMeme();
//});

class Picture {
  constructor(title, link) {
    this.title = title;
    this.link = link;
  }
}

class Phrase {
  constructor(content, color = "000000") {
    this.content = content;
    this.color = `#${color}`;
  }
}

class Meme {
  constructor(title, picture, phrase, phrase_position) {
    this.title = title;
    this.picture = picture; // picture object
    this.phrase = phrase; // phrase object
    this.phrase_position = phrase_position; // 1 = top, 2 = bottom
  }
}

/*******************************************
 * Below are rough functions to test functionality
 *******************************************/
function getData() {
  return fetch(`${PICTURES_URL}/2`).then(resp => resp.json());
}

function loadMeme() {
  let memeSpace = document.getElementById("content");
  let imgDiv = document.createElement("div");
  imgDiv.setAttribute("class", "img");
  let meme = document.createElement("img");
  fetch(`${PICTURES_URL}/12`)
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
  while (memeSpace.firstChild) {
    memeSpace.removeChild(memeSpace.firstChild);
  }
  memeSpace.removeAttribute("class");
}
