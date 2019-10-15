const BASE_URL = "http://localhost:3000";
const PICTURES_URL = `${BASE_URL}/pictures`;
const PICTURES = [];

document.addEventListener("DOMContentLoaded", function() {
  loadPictures();
});

class Picture {
  constructor(id, title, link) {
    this.id = id;
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

function loadPictures() {
  fetch(`${PICTURES_URL}`)
    .then(resp => resp.json())
    .then(json => {
      for (let i = 0; i < json.length; i++){
        PICTURES.push(new Picture(json[i].id, json[i].title, json[i].link));
      }
    });
}

/*******************************************
 * Below are rough functions to test functionality
 *******************************************/

function loadMeme() {
  let memeSpace = document.getElementById("content");
  let imgDiv = document.createElement("div");
  imgDiv.setAttribute("class", "img-div");
  let meme = document.createElement("img");
  meme.setAttribute("class", "img");
  let randNum = Math.floor(Math.random() * 12);
  fetch(`${PICTURES_URL}/${PICTURES[randNum].id}`)
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
