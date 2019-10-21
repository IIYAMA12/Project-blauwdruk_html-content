
/*
  Inspiration from:
  https://www.w3schools.com/howto/howto_js_draggable.asp
*/

function dragElement(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  function dragMouseDown(e) {
    e = e || window.event;
    

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.addEventListener("mouseup", closeDragElement, false);

    document.addEventListener("mousemove", elementDrag, false);

    e.preventDefault();
  }

  function elementDrag(e) {
    e = e || window.event;
    

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // var viewportOffset = element.getBoundingClientRect();
    // // these are relative to the viewport, i.e. the window
    // var top = viewportOffset.top;
    // var left = viewportOffset.left;

    element.style.top = (element.offsetTop - pos2) + "px";

    element.style.left = (element.offsetLeft - pos1) + "px";

    e.preventDefault();
  }

  element.addEventListener("mousedown", dragMouseDown, false);

  function closeDragElement() {
    document.removeEventListener("mouseup", closeDragElement, false);
    document.removeEventListener("mousemove", elementDrag, false);
  }
}

const imageDialog = document.getElementById("image-dialog");
dragElement(imageDialog);


function hideImageDialog () {
  imageDialog.classList.add("hidden");
}

function showImageDialog () {
  imageDialog.classList.remove("hidden");
}

document.getElementById("close-image-dialog").addEventListener("click", hideImageDialog, false)

function setScreenshotsViewAble(parent) {
  const images = parent.getElementsByTagName("img");
  const containerImage = imageDialog.getElementsByTagName("img")[0];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    image.addEventListener("click", function () {
      containerImage.src = this.src;
      containerImage.alt = this.alt;
      showImageDialog(); 
    });
  }
}