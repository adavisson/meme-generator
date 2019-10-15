document.addEventListener("DOMContentLoaded", function() {
  //loadMeme();
});

function loadMeme() {
  let memeSpace = document.getElementById("content");
  let header = document.createElement("h2");
  header.innerHTML = "super rad meme";
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Get outta here!";
  deleteButton.setAttribute("class", "btn btn-primary");
  deleteButton.addEventListener("click", e => {
    deleteMeme();
  });
  memeSpace.style.textAlign = "center";
  memeSpace.setAttribute("class", "meme-space");
  memeSpace.appendChild(header);
  memeSpace.appendChild(deleteButton);
}

function deleteMeme() {
  let memeSpace = document.getElementById("content");
  while(memeSpace.firstChild) {
    memeSpace.removeChild(memeSpace.firstChild);
  }
  memeSpace.removeAttribute("class");
}