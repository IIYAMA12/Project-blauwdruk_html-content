(function() {
  const showMoreContainers = document.getElementsByClassName("show-more-container");
  const showMore = function (e) {
    const parent = this.showMoreContainerElement;
    parent.classList.toggle("open");
  };

  for (let i = 0; i < showMoreContainers.length; i++) {
    const showMoreContainer = showMoreContainers[i];
    const button = showMoreContainer.getElementsByClassName("show-more-button")[0];
    if (button != undefined) {
      button.addEventListener("click", showMore, false);
      button.showMoreContainerElement = showMoreContainer;
    }
  }
})();
