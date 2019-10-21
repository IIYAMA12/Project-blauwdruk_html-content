
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

function scrollToResearchQuestionElement() {
  const item = dataManager.getItemFromElement(this);
  if (item != undefined) {
    scrollToResearchQuestionElementByItem(item);
  }
}


function scrollToResearchQuestionElementByItem (item) {
  const researchQuestionElements = document.getElementById("research-question-list").children;
  for (let i = 0; i < researchQuestionElements.length; i++) {
    const researchQuestionElement = researchQuestionElements[i];
    if (dataManager.getItemFromElement(researchQuestionElement) == item) {
      changeTab("tab-panel-main-content", 2);
      researchQuestionElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      closeDialog();
      scrollToElementHighlight(researchQuestionElement);
      break;
    }
  }
}