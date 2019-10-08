
(function() {
  const showMoreButtons = document.getElementsByClassName("research-question-question-show-more");
  const showMore = function (e) {
    const parent = this.parentElement;
    parent.classList.toggle("open");
    // const openStatus = parent.classList.contains("open");
  };

  for (let i = 0; i < showMoreButtons.length; i++) {
    const showMoreButton = showMoreButtons[i];
    showMoreButton.addEventListener("click", showMore);
  }
})();
