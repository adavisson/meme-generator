const BASE_URL = "http://localhost:3000";
const PICTURES_URL = `${BASE_URL}/pictures`;
const CONTENT_DIV = document.getElementById("content");
const FORM_DIV = document.getElementById("form-div");
const PICTURES = [];

document.addEventListener("DOMContentLoaded", function() {
  loadPictures();
  //loadForm();
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
      for (let i = 0; i < json.length; i++) {
        PICTURES.push(new Picture(json[i].id, json[i].title, json[i].link));
      }
    })
    .then(loadForm);
}

function loadForm() {
  const memeForm = document.createElement("form");      // Create form element
  memeForm.setAttribute("action", `${PICTURES_URL}`);
  memeForm.setAttribute("method", "POST");
  memeForm.addEventListener("submit", e => loadMeme(e));

  const picLabel = document.createElement("label");     // Create label for picture dropdown
  picLabel.innerHTML = "Pick a Pic: &nbsp";
  memeForm.appendChild(picLabel);

  const picDropdown = document.createElement("select"); // Create picture dropdown
  picDropdown.setAttribute("class", "meme-dropdown");
  for (let i = 0; i <= PICTURES.length; i++) {
    if (i === PICTURES.length) {
      const opt = document.createElement("option");
      opt.setAttribute("value", "13");
      opt.innerHTML = "Random";
      picDropdown.appendChild(opt);
    } else {
      const opt = document.createElement("option");
      opt.setAttribute("value", `${PICTURES[i].id}`);
      opt.innerHTML = `${PICTURES[i].title}`;
      picDropdown.appendChild(opt);
    }
  }
  memeForm.appendChild(picDropdown);

  memeForm.appendChild(document.createElement("br"));
  memeForm.appendChild(document.createElement("br"));

  const generateMemeButton = document.createElement("input");   // Create submit button
  generateMemeButton.setAttribute("type", "submit");
  generateMemeButton.setAttribute("value", "Meme It!");
  generateMemeButton.setAttribute("class", "btn btn-primary");
  memeForm.appendChild(generateMemeButton);

  FORM_DIV.appendChild(memeForm);
}

function loadMeme(e) {
  e.preventDefault();   // Prevent form from default action of submitting to /pictures
  deleteMeme();         // Clear meme if present

  const imgDiv = document.createElement("div");   // Create img-div
  imgDiv.setAttribute("class", "img-div");

  const meme = document.createElement("img");     // Create img tag 
  meme.setAttribute("class", "img");
  imgDiv.appendChild(meme);

  const memeNum = document.querySelector(".meme-dropdown").value;   // Load selected picture with fetch call
  if (memeNum === "13"){
    const randNum = Math.floor(Math.random() * PICTURES.length);
    fetch(`${PICTURES_URL}/${PICTURES[randNum].id}`)
      .then(resp => resp.json())
      .then(json => {
        meme.setAttribute("src", `${json.link}`);
      });
  } else {
    fetch(`${PICTURES_URL}/${memeNum}`)
      .then(resp => resp.json())
      .then(json => {
        meme.setAttribute("src", `${json.link}`);
      });
  }

  const deleteButton = document.createElement("button");    // Create delete button
  deleteButton.innerHTML = "Get outta here!";
  deleteButton.setAttribute("class", "btn btn-primary");
  deleteButton.addEventListener("click", e => {
    deleteMeme();
  });

  CONTENT_DIV.setAttribute("class", "meme-space");      // Add class for gaudy border
  CONTENT_DIV.appendChild(imgDiv);
  CONTENT_DIV.appendChild(deleteButton);
}

function deleteMeme() {             // Clear content area of meme
  while (CONTENT_DIV.firstChild) {
    CONTENT_DIV.removeChild(CONTENT_DIV.firstChild);
  }
  CONTENT_DIV.removeAttribute("class");
}
