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

  const picDiv = document.createElement("div");
  picDiv.setAttribute("class", "form-group");
  memeForm.appendChild(picDiv);

  const picLabel = document.createElement("label");     // Create label for picture dropdown
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

  const phraseLabel = document.createElement("label");  // Create label for phrase input
  phraseLabel.innerHTML = "Phill in a Phrase:";
  phraseDiv.appendChild(phraseLabel);

  const phraseInput = document.createElement("input");  // Create phrase input element
  phraseInput.setAttribute("type", "text");
  phraseInput.setAttribute("class", "form-control");
  phraseInput.setAttribute("id", "phrase")
  phraseDiv.appendChild(phraseInput);

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

  const pic = document.createElement("img");     // Create img tag 
  pic.setAttribute("class", "img");
  imgDiv.appendChild(pic);

  const memeNum = document.querySelector(".meme-dropdown").value;   // Load selected picture with fetch call
  if (memeNum === "13"){
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

  const phrase = document.getElementById("phrase").value;
  console.log(phrase);
  const phraseDiv = document.createElement("div");
  phraseDiv.setAttribute("class", "top");
  phraseDiv.innerHTML = `${phrase}`;
  imgDiv.appendChild(phraseDiv);

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
