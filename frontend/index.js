const BASE_URL = "http://localhost:3000";
const PICTURES_URL = `${BASE_URL}/pictures`;
const PHRASES_URL = `${BASE_URL}/phrases`;
const MEMES_URL = `${BASE_URL}/memes`;
const CONTENT_DIV = document.getElementById("content");
const FORM_DIV = document.getElementById("form-div");
const PICTURES = [];
const PHRASES = [];
const COMMON_PHRASES = [];
const MEMES = [];
const COLORS = {
  Red: "FF0000",
  Orange: "FFA500",
  Yellow: "FFFF00",
  Green: "008000",
  Blue: "0000FF",
  Purple: "800080",
  Black: "000000",
  White: "FFFFFF"
};

/*********************************************
 * Class List:
 *  Picture
 *  Phrase
 *  Meme
 * 
 * Function List:
 *  loadPictures
 *  loadPhrases
 *  loadCommonPhrases
 *  loadMemes
 *  getPhrase
 *  getPic
 *  loadForm
 *    newPhrase
 *    existingPhrase
 *    usedPhrases
 *  pickMemes
 *  loadExistingMemeForm
 *  loadMeme
 *  displayMeme
 *  deleteChildElements
 *********************************************/

document.addEventListener("DOMContentLoaded", async function() {
  // Go ahead and load all of the phrases and pictures when the app loads
  loadPhrases();  
  await loadPictures();
});

class Picture {
  constructor(id, title, link) {
    this._id = id;
    this.title = title;
    this.link = link;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

class Phrase {
  constructor(content, color = "000000") {
    this.content = content;
    this.color = `#${color}`;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

Phrase.prototype.save = function() {
  // Function to save phrase through API with a POST 
  let phrase = {
    content: this.content
  };

  let configObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(phrase)
  };

  return fetch(`${PHRASES_URL}`, configObject)
    .then(resp => resp.json())
    .then(json => {
      this._id = json.id;
      PHRASES.push(this);
    })
    .then();
};

class Meme {
  constructor(title, picture, phrase, phrasePosition) {
    this.title = title;
    this.picture = picture; // picture object
    this.phrase = phrase; // phrase object
    this.phrasePosition = phrasePosition; // 1 = top, 2 = bottom
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

Meme.prototype.save = function() {
  // Function to save Meme through API with a POST
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
  };

  return fetch(`${MEMES_URL}`, configObject)
    .then(resp => resp.json())
    .then(json => {
      const phrase = getPhrase(json.phrase_id);
      const pic = getPic(json.picture_id);
      // const meme = new Meme(
      //   json.title,
      //   pic,
      //   phrase,
      //   json.phrase_position
      // );
      MEMES.push(this);
    });
}

function sortPics() {
  // items.sort(function(a, b) {
  //   var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  //   var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  //   if (nameA < nameB) {
  //     return -1;
  //   }
  //   if (nameA > nameB) {
  //     return 1;
  //   }
  
    // // names must be equal
    // return 0;

  fetch(`${PICTURES_URL}`)
    .then(resp => resp.json())
    .then(json => {
      json.sort(function(a,b){
        let titleA = a.title.toLowerCase();
        let titleB = b.title.toLowerCase();
        if (titleA < titleB){
          return -1;
        } else if (titleA > titleB) {
          return 1;
        } else {
          return 0;
        }
      });
      console.log(json);
      displayTitles(json);
    });
}

function displayTitles(json){
  const listDiv = document.getElementById("sortedList");

  const ulList = document.createElement("ul");
  listDiv.appendChild(ulList);

  for (let i = 0; i < json.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `${json[i].title}`;
    ulList.appendChild(li);
  }
}

async function loadPictures() {
  // Clear PICTURES Array
  PICTURES.length = 0;

  // GET all of the pictures, create new JS Picture objects and 
  // load them into PICTURES array
  // fetch(`${PICTURES_URL}`)
    // .then(resp => resp.json())
    // .then(json => {
      // for (let i = 0; i < json.length; i++) {
        // PICTURES.push(new Picture(json[i].id, json[i].title, json[i].link));
      // }
    // });

  // Async

  const result = await fetch(PICTURES_URL);
  const json = await result.json();
  for (let i = 0; i < json.length; i++) {
    PICTURES.push(new Picture(json[i].id, json[i].title, json[i].link));
  }

}

function loadPhrases(func) {
  // Clear PHRASES Array
  PHRASES.length = 0;

  // GET all of the phrases, create JS Phrase objects and
  // load them into PHRASES array
  fetch(`${PHRASES_URL}`)
    .then(resp => resp.json())
    .then(json => {
      for (let i = 0; i < json.length; i++) {
        const phrase = new Phrase(json[i].content);
        phrase.id = json[i].id;
        PHRASES.push(phrase);
      }
    })
    .then(func);
}

function loadCommonPhrases(id){
  // Clear common phrases array
  COMMON_PHRASES.length = 0;

  // GET a user selected picture, load all of the associated 
  // phrases into PHRASES array
  return fetch(`${PICTURES_URL}/${id}`)
    .then(resp => resp.json())
    .then(json => {
      for (let i = 0; i < json.phrases.length; i++){
        COMMON_PHRASES.push(json.phrases[i]);
      }
    });
}

function loadMemes() {
  // Clear MEMES Array
  MEMES.length = 0;

  // GET all memes, create JS Meme objects and load them
  // into Memes array
  return fetch(`${MEMES_URL}`)
    .then(resp => resp.json())
    .then(json => {
      for (let i = 0; i < json.length; i++) {
        const phrase = getPhrase(json[i].phrase_id);  // Get phrase object associated with id
        const pic = getPic(json[i].picture_id); // Get pic object associated with id
        const meme = new Meme(
          json[i].title,
          pic,
          phrase,
          json[i].phrase_position
        );
        MEMES.push(meme);
      }
    });
}

function getPhrase(id) {
  // Return phrase object with matching id
  for (let i = 0; i < PHRASES.length; i++) {
    if (id === PHRASES[i].id) {
      return PHRASES[i];
    }
  }
}

function getPic(id) {
  // Return pic object with matching id
  for (let i = 0; i < PICTURES.length; i++) {
    if (id === PICTURES[i].id) {
      return PICTURES[i];
    }
  }
}

function loadForm() {
  //deleteFormDivContents(); //Clear form area
  deleteChildElements(FORM_DIV);

  function newPhrase() {
    // Loads phraseDiv with form elements for a new phrase
    const existingPhraseButton = document.createElement("button");
    existingPhraseButton.innerHTML = "Choose Existing Phrase";
    existingPhraseButton.setAttribute("class", "btn btn-primary");
    existingPhraseButton.addEventListener("click", e => {
      while (phraseDiv.firstChild) {
        phraseDiv.removeChild(phraseDiv.firstChild);
      }
      loadPhrases(existingPhrase);
    });
    phraseDiv.appendChild(existingPhraseButton);

    const popularPhraseButton = document.createElement("button");
    popularPhraseButton.innerHTML = "Phrases popular w/ Pic";
    popularPhraseButton.setAttribute("class", "btn btn-primary");
    popularPhraseButton.addEventListener("click", e => {
      deleteChildElements(phraseDiv);
      usedPhrases();
    });
    phraseDiv.appendChild(popularPhraseButton);

    phraseDiv.appendChild(document.createElement("br"));

    const phraseLabel = document.createElement("label"); // Create label for phrase input
    phraseLabel.innerHTML = "Fill in a Phrase:";
    phraseDiv.appendChild(phraseLabel);

    const phraseInput = document.createElement("input"); // Create phrase input element
    phraseInput.setAttribute("type", "text");
    phraseInput.setAttribute("class", "form-control");
    phraseInput.setAttribute("id", "phrase");
    phraseInput.required = true;
    phraseDiv.appendChild(phraseInput);

    const phraseSaveButton = document.createElement("button");
    phraseSaveButton.innerHTML = "Save the Phrase";
    phraseSaveButton.setAttribute("class", "btn btn-primary");
    phraseSaveButton.addEventListener("click", e => {
      e.preventDefault();
      new Phrase(document.getElementById("phrase").value).save();
      alert("Saved the phrase");
    });
    phraseDiv.appendChild(phraseSaveButton);
  }

  function existingPhrase() {
    // Loads phraseDiv with elements to select from all existing phrases
    const newPhraseButton = document.createElement("button");
    newPhraseButton.innerHTML = "Create a Phrase";
    newPhraseButton.setAttribute("class", "btn btn-primary");
    newPhraseButton.addEventListener("click", e => {
      while (phraseDiv.firstChild) {
        phraseDiv.removeChild(phraseDiv.firstChild);
      }
      newPhrase();
    });
    phraseDiv.appendChild(newPhraseButton);

    const popularPhraseButton = document.createElement("button");
    popularPhraseButton.innerHTML = "Phrases popular w/ Pic";
    popularPhraseButton.setAttribute("class", "btn btn-primary");
    popularPhraseButton.addEventListener("click", e => {
      deleteChildElements(phraseDiv);
      usedPhrases();
    });
    phraseDiv.appendChild(popularPhraseButton);

    phraseDiv.appendChild(document.createElement("br"));

    const phraseLabel = document.createElement("label"); // Create phrase label
    phraseLabel.innerHTML = "Choose an existing phrase";
    phraseDiv.appendChild(phraseLabel);

    const phraseDropDown = document.createElement("select");
    phraseDropDown.setAttribute("class", "form-control");
    phraseDropDown.setAttribute("id", "phrase");
    for (let i = 0; i < PHRASES.length; i++) {
      const opt = document.createElement("option");
      opt.setAttribute("value", `${PHRASES[i].content}`);
      opt.innerHTML = `${PHRASES[i].content}`;
      phraseDropDown.appendChild(opt);
    }
    phraseDiv.appendChild(phraseDropDown);
  }

  function usedPhrases() {
    // Loads phraseDiv with form elements to select from common phrases
    const newPhraseButton = document.createElement("button");
    newPhraseButton.innerHTML = "Create a Phrase";
    newPhraseButton.setAttribute("class", "btn btn-primary");
    newPhraseButton.addEventListener("click", e => {
      while (phraseDiv.firstChild) {
        phraseDiv.removeChild(phraseDiv.firstChild);
      }
      newPhrase();
    });
    phraseDiv.appendChild(newPhraseButton);

    const existingPhraseButton = document.createElement("button");
    existingPhraseButton.innerHTML = "Choose Existing Phrase";
    existingPhraseButton.setAttribute("class", "btn btn-primary");
    existingPhraseButton.addEventListener("click", e => {
      while (phraseDiv.firstChild) {
        phraseDiv.removeChild(phraseDiv.firstChild);
      }
      loadPhrases(existingPhrase);
    });
    phraseDiv.appendChild(existingPhraseButton);

    const popularPhraseButton = document.createElement("button");
    popularPhraseButton.innerHTML = "Update Phrases";
    popularPhraseButton.setAttribute("class", "btn btn-primary");
    popularPhraseButton.addEventListener("click", e => {
      deleteChildElements(phraseDiv);
      usedPhrases();
    });
    phraseDiv.appendChild(popularPhraseButton);

    phraseDiv.appendChild(document.createElement("br"));

    let picNum = document.querySelector(".meme-dropdown").value;
    if (picNum > PICTURES.length){
      alert("Choose a picture other than random.");
    } else {
      loadCommonPhrases(picNum)
        .then(() => {
          const phraseLabel = document.createElement("label"); // Create phrase label
          phraseLabel.innerHTML = "Choose a common phrase:";
          phraseDiv.appendChild(phraseLabel);

          const phraseDropDown = document.createElement("select");
          phraseDropDown.setAttribute("class", "form-control");
          phraseDropDown.setAttribute("id", "phrase");
          for (let i = 0; i < COMMON_PHRASES.length; i++){
            const opt = document.createElement("option");
            opt.setAttribute("value", `${COMMON_PHRASES[i].content}`);
            opt.innerHTML = `${COMMON_PHRASES[i].content}`;
            phraseDropDown.appendChild(opt);
          }
          phraseDiv.appendChild(phraseDropDown);
        });
    }
  }

  const memeForm = document.createElement("form"); // Create form element
  memeForm.setAttribute("action", `${MEMES_URL}`);
  memeForm.setAttribute("method", "POST");
  memeForm.addEventListener("submit", e => loadMeme(e));

  const existingMemeButton = document.createElement("button");  // Button to load existling meme elements
  existingMemeButton.setAttribute("class", "btn btn-primary");
  existingMemeButton.innerHTML = "Pick an existing meme!";
  existingMemeButton.addEventListener("click", e => {
    e.preventDefault;
    pickMemes();
  });
  memeForm.appendChild(existingMemeButton);

  memeForm.appendChild(document.createElement("br"));
  memeForm.appendChild(document.createElement("br"));

  ////////////// Title ///////////////
  const titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "form-group");
  memeForm.appendChild(titleDiv);

  const titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Title:";
  titleDiv.appendChild(titleLabel);

  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("id", "title");
  titleInput.setAttribute("class", "form-control");
  titleInput.required = true;
  titleDiv.appendChild(titleInput);

  ////////////// Picture Selection ///////////////
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

  ////////////// Phrase Selection ///////////////
  const phraseDiv = document.createElement("div");
  phraseDiv.setAttribute("class", "form-group");
  memeForm.appendChild(phraseDiv);

  const newPhraseButton = document.createElement("button");
  newPhraseButton.innerHTML = "Create a Phrase";
  newPhraseButton.setAttribute("class", "btn btn-primary");
  newPhraseButton.addEventListener("click", e => {
    deleteChildElements(phraseDiv);
    newPhrase();
  });
  phraseDiv.appendChild(newPhraseButton);

  const existingPhraseButton = document.createElement("button");
  existingPhraseButton.innerHTML = "Choose Existing Phrase";
  existingPhraseButton.setAttribute("class", "btn btn-primary");
  existingPhraseButton.addEventListener("click", e => {
    deleteChildElements(phraseDiv);
    loadPhrases(existingPhrase);
  });
  phraseDiv.appendChild(existingPhraseButton);

  const popularPhraseButton = document.createElement("button");
  popularPhraseButton.innerHTML = "Phrases popular w/ Pic";
  popularPhraseButton.setAttribute("class", "btn btn-primary");
  popularPhraseButton.addEventListener("click", e => {
    deleteChildElements(phraseDiv);
    usedPhrases();
  });
  phraseDiv.appendChild(popularPhraseButton);

  ////////////// Phrase color selection ///////////////
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

  ////////////// Phrase position selection ///////////////
  const textPositionDiv = document.createElement("div");
  textPositionDiv.setAttribute("class", "form-group");
  memeForm.appendChild(textPositionDiv);

  const textPositionTopLabel = document.createElement("label");
  textPositionTopLabel.setAttribute("class", "radio-inline");
  textPositionTopLabel.innerHTML = " Top ";
  textPositionDiv.appendChild(textPositionTopLabel);

  const textPositionTop = document.createElement("input");
  textPositionTop.setAttribute("type", "radio");
  textPositionTop.setAttribute("name", "textPos");
  textPositionTop.setAttribute("value", "top");
  textPositionTop.setAttribute("id", "textPosTop");
  textPositionTop.checked = true;
  textPositionTopLabel.appendChild(textPositionTop);

  const textPositionBottomLabel = document.createElement("label");
  textPositionBottomLabel.setAttribute("class", "radio-inline");
  textPositionBottomLabel.innerHTML = " Bottom ";
  textPositionDiv.appendChild(textPositionBottomLabel);

  const textPositionBottom = document.createElement("input");
  textPositionBottom.setAttribute("type", "radio");
  textPositionBottom.setAttribute("name", "textPos");
  textPositionBottom.setAttribute("value", "bottom");
  textPositionBottom.setAttribute("id", "textPosTop");
  textPositionBottomLabel.appendChild(textPositionBottom);

  const generateMemeButton = document.createElement("input"); // Create submit button
  generateMemeButton.setAttribute("type", "submit");
  generateMemeButton.setAttribute("value", "Meme It!");
  generateMemeButton.setAttribute("class", "btn btn-primary");
  memeForm.appendChild(generateMemeButton);

  FORM_DIV.appendChild(memeForm);
}

function pickMemes(){
  // Get all memes and then load the Existing meme elements
  loadMemes()
    .then(loadExistingMemeForm);
}

function loadExistingMemeForm() {
  deleteChildElements(FORM_DIV);  // Remove all elements from FORM_DIV

  // Button to load new meme form
  const createMemeButton = document.createElement("button");
  createMemeButton.setAttribute("class", "btn btn-primary");
  createMemeButton.innerHTML = "Create a New Meme!";
  createMemeButton.addEventListener("click", e => {
    e.preventDefault();
    loadForm();
  });
  FORM_DIV.appendChild(createMemeButton);

  FORM_DIV.appendChild(document.createElement("br"));
  FORM_DIV.appendChild(document.createElement("br"));

  ////////////// Existing meme selection ///////////////
  const selectMemeDiv = document.createElement("div");
  selectMemeDiv.setAttribute("class", "form-group")
  FORM_DIV.appendChild(selectMemeDiv);

  const selectMemeLabel = document.createElement("label");
  selectMemeLabel.innerHTML = "Select a Meme";
  selectMemeDiv.appendChild(selectMemeLabel);

  const selectMemeDropDown = document.createElement("select");
  selectMemeDropDown.setAttribute("class", "meme-dropdown form-control");
  for (let i = 0; i < MEMES.length; i++){
    const opt = document.createElement("option");
    opt.setAttribute("value", i);
    opt.innerHTML = `${MEMES[i].title}`;
    selectMemeDropDown.appendChild(opt);
  }
  selectMemeDiv.appendChild(selectMemeDropDown);

  ////////////// Phrase color selection ///////////////
  const phraseColorDiv = document.createElement("div");
  phraseColorDiv.setAttribute("class", "form-group");
  FORM_DIV.appendChild(phraseColorDiv);

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

  const selectButton = document.createElement("button");
  selectButton.setAttribute("class", "btn btn-primary");
  selectButton.innerHTML = "Select Meme";
  selectButton.addEventListener("click", e => {
    const meme = MEMES[document.querySelector(".meme-dropdown").value];
    meme.phrase.color = `#${document.querySelector(".phrase-color-dropdown").value}`;
    displayMeme(meme);
  });
  FORM_DIV.appendChild(selectButton);
}

function loadMeme(e) {
  // Get values from form elements and create new JS Meme object

  e.preventDefault(); // Prevent form from default action of submitting to /pictures
  let title, picture, phrase, phrasePosition;

  title = document.getElementById("title").value;

  const picNum = document.querySelector(".meme-dropdown").value; // Load selected picture with fetch call
  if (picNum > PICTURES.length) {
    const randNum = Math.floor(Math.random() * PICTURES.length);
    picture = PICTURES[randNum];
    console.log(randNum);
  } else {
    picture = PICTURES[picNum - 1];
  }

  for (let i = 0; i < PHRASES.length; i++) {
    if (PHRASES[i].content === document.getElementById("phrase").value) {
      phrase = PHRASES[i];
      phrase.color = `#${
        document.querySelector(".phrase-color-dropdown").value
      }`;
      break;
    }
  }
  if (!phrase) {
    phrase = new Phrase(
      document.getElementById("phrase").value,
      document.querySelector(".phrase-color-dropdown").value
    );
  }
  const phrasePositionElement = document.getElementsByName("textPos");
  for (let i = 0; i < phrasePositionElement.length; i++) {
    if (phrasePositionElement[i].checked) {
      phrasePosition = phrasePositionElement[i].value;
      break;
    }
  }

  const meme = new Meme(title, picture, phrase, phrasePosition);
  displayMeme(meme);
}

function displayMeme(meme) {
  // Display the meme using all of the user selections

  deleteChildElements(CONTENT_DIV);
  CONTENT_DIV.removeAttribute("class");

  const imgDiv = document.createElement("div"); // Create img-div
  imgDiv.setAttribute("class", "img-div");

  const pic = document.createElement("img"); // Create img tag
  pic.setAttribute("class", "img");
  imgDiv.appendChild(pic);
  fetch(`${PICTURES_URL}/${meme.picture.id}`)
    .then(resp => resp.json())
    .then(json => {
      pic.setAttribute("src", `${json.link}`);
    });

  const phraseDiv = document.createElement("div");
  phraseDiv.style.color = `${meme.phrase.color}`;
  phraseDiv.innerHTML = `${meme.phrase.content}`;
  phraseDiv.setAttribute("class", `${meme.phrasePosition}`);
  imgDiv.appendChild(phraseDiv);

  const saveButton = document.createElement("button");
  saveButton.innerHTML = "Save the Meme!";
  saveButton.setAttribute("class", "btn btn-primary");
  saveButton.addEventListener("click", e => {
    meme.phrase
      .save()
      .then(() => meme.save())
      .then(() => alert("Meme Saved"));
  });
  CONTENT_DIV.appendChild(saveButton);

  const deleteButton = document.createElement("button"); // Create delete button
  deleteButton.innerHTML = "Get outta here!";
  deleteButton.setAttribute("class", "btn btn-primary");
  deleteButton.addEventListener("click", e => {
    deleteChildElements(CONTENT_DIV);
    CONTENT_DIV.removeAttribute("class");
  });
  CONTENT_DIV.appendChild(deleteButton);

  CONTENT_DIV.setAttribute("class", "meme-space"); // Add class for gaudy border
  CONTENT_DIV.appendChild(imgDiv);
}

function deleteChildElements(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
