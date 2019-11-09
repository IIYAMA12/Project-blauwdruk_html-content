
function openConnectedContentList () {
  this.parentElement.classList.remove("close");
}

const closeConnectedContentList = function (e) {
  if (e.target === this) {
    this.classList.add("close");
  }
};
