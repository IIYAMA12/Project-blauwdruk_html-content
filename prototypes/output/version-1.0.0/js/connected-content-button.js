(function(){
  const connectedContentButtonWrappers = document.getElementsByClassName("connected-content-button-wrapper");
  const openList = function () {
    console.log("open");
    this.parentElement.classList.remove("close");
  };
  const closeList = function (e) {
    if (e.target === this) {
      this.classList.add("close");
    }
  };
  for (let i = 0; i < connectedContentButtonWrappers.length; i++) {
    const connectedContentButtonWrapper = connectedContentButtonWrappers[i];
    connectedContentButtonWrapper.getElementsByClassName("connected-content-button")[0].addEventListener("click", openList, false);
    connectedContentButtonWrapper.addEventListener("mouseleave", closeList, false);
  }
})();