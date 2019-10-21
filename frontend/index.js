const BASE_URL = "http://localhost:3000";
const PICTURES_URL = `${BASE_URL}/pictures`;
const PHRASES_URL = `${BASE_URL}/phrases`;
const MEMES_URL = `${BASE_URL}/memes`;
const CONTENT_DIV = document.getElementById("content");
const FORM_DIV = document.getElementById("form-div");
const PICTURES = [];
const PHRASES = [];
const COLORS = {
  Red: "FF0000",
  Orange: "FFA500",
  Yellow: "FFFF00",
  Green: "008000",
  Blue: "0000FF",
  Purple: "800080",
  Black: "000000"
};

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

  save() {}
}

class Meme {
  constructor(title, picture, phrase, phrasePosition) {
    this.title = title;
    this.picture = picture; // picture object
    this.phrase = phrase; // phrase object
    this.phrasePosition = phrasePosition; // 1 = top, 2 = bottom
  }

  // Make this a prototype?
  save() {
    let meme = {
      title: this.title,
      phrase_position: this.phrasePosition,
      phrase_id: this.phrase.id,
      picture_id: this.picture.id
    };

    let configObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(meme)
    }

    fetch(`${MEMES_URL}`,configObject)
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

function loadPhrases() {
  fetch(`${PHRASES_URL}`)
    .then(resp => resp.json())
    .then(json => {
      for (let i = 0; i < json.length; i++) {
        PHRASES.push(new Phrase(json[i].content));
      }
    })
    .then(console.log(PHRASES));
}

function loadForm() {
  const memeForm = document.createElement("form"); // Create form element
  memeForm.setAttribute("action", `${PICTURES_URL}`);
  memeForm.setAttribute("method", "POST");
  memeForm.addEventListener("submit", e => loadMeme(e));

  const picDiv = document.createElement("div");
  picDiv.setAttribute("class", "form-group");
  memeForm.appendChild(picDiv);

  const picLabel = document.createElement("label"); // Create label for picture dropdown
  picLabel.innerHTML = "Pick a Pic:";
  picDiv.appendChild(picLabel);

  const picDropdown = document.createElement("select"); // Create picture dropdown
  picDropdown.setAttribute("class", "meme-dropdown form-control");
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
  picDiv.appendChild(picDropdown);

  const phraseDiv = document.createElement("div");
  phraseDiv.setAttribute("class", "form-group");
  memeForm.appendChild(phraseDiv);

  const phraseLabel = document.createElement("label"); // Create label for phrase input
  phraseLabel.innerHTML = "Phill in a Phrase:";
  phraseDiv.appendChild(phraseLabel);

  const phraseInput = document.createElement("input"); // Create phrase input element
  phraseInput.setAttribute("type", "text");
  phraseInput.setAttribute("class", "form-control");
  phraseInput.setAttribute("id", "phrase");
  phraseDiv.appendChild(phraseInput);

  const phraseColorDiv = document.createElement("div");
  phraseColorDiv.setAttribute("class", "form-group");
  memeForm.appendChild(phraseColorDiv);

  const phraseColorLabel = document.createElement("label"); // Create phrase color label
  phraseColorLabel.innerHTML = "Choose a color:";
  phraseColorDiv.appendChild(phraseColorLabel);

  const phraseColorDropdown = document.createElement("select"); // Create dropdown for phrase color
  phraseColorDropdown.setAttribute(
    "class",
    "phrase-color-dropdown form-control"
  );
  for (let key in COLORS) {
    const opt = document.createElement("option");
    opt.setAttribute("value", `${COLORS[key]}`);
    opt.innerHTML = `${key}`;
    phraseColorDropdown.appendChild(opt);
  }
  phraseColorDiv.appendChild(phraseColorDropdown);

  const generateMemeButton = document.createElement("input"); // Create submit button
  generateMemeButton.setAttribute("type", "submit");
  generateMemeButton.setAttribute("value", "Meme It!");
  generateMemeButton.setAttribute("class", "btn btn-primary");
  memeForm.appendChild(generateMemeButton);

  FORM_DIV.appendChild(memeForm);
}

function loadMeme(e) {
  e.preventDefault(); // Prevent form from default action of submitting to /pictures
  deleteMeme(); // Clear meme if present

  const imgDiv = document.createElement("div"); // Create img-div
  imgDiv.setAttribute("class", "img-div");

  const pic = document.createElement("img"); // Create img tag
  pic.setAttribute("class", "img");
  imgDiv.appendChild(pic);

  const memeNum = document.querySelector(".meme-dropdown").value; // Load selected picture with fetch call
  if (memeNum === "13") {
    const randNum = Math.floor(Math.random() * PICTURES.length);
    fetch(`${PICTURES_URL}/${PICTURES[randNum].id}`)
      .then(resp => resp.json())
      .then(json => {
        pic.setAttribute("src", `${json.link}`);
      });
  } else {
    fetch(`${PICTURES_URL}/${memeNum}`)
      .then(resp => resp.json())
      .then(json => {
        pic.setAttribute("src", `${json.link}`);
      });
  }

  /*************************************
   * Get phrase and add it to meme
   *************************************/

  // Create phrase object
  const phrase = new Phrase(
    document.getElementById("phrase").value,
    document.querySelector(".phrase-color-dropdown").value
  );
  const phraseDiv = document.createElement("div");
  phraseDiv.setAttribute("class", "top");
  phraseDiv.style.color = `${phrase.color}`;
  phraseDiv.innerHTML = `${phrase.content}`;
  imgDiv.appendChild(phraseDiv);

  const deleteButton = document.createElement("button"); // Create delete button
  deleteButton.innerHTML = "Get outta here!";
  deleteButton.setAttribute("class", "btn btn-primary");
  deleteButton.addEventListener("click", e => {
    deleteMeme();
  });

  CONTENT_DIV.setAttribute("class", "meme-space"); // Add class for gaudy border
  CONTENT_DIV.appendChild(imgDiv);
  CONTENT_DIV.appendChild(deleteButton);
}

function deleteMeme() {
  // Clear content area of meme
  while (CONTENT_DIV.firstChild) {
    CONTENT_DIV.removeChild(CONTENT_DIV.firstChild);
  }
  CONTENT_DIV.removeAttribute("class");
}
