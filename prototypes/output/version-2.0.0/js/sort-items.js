function sortListOnKey (list, key, down) {
  const sortElements = list.children;
  const sortList = [];
  for (let i = 0; i < sortElements.length; i++) {
    const element = sortElements[i];
    sortList[sortList.length] = {
      element: element,
      name: dataManager.getItemFromElement(element) != undefined ? String(dataManager.getItemFromElement(element).getData(key) || "") : " "
    };
  }
  sortList.sort(function (a, b) {
    if (down) {
      return a.name > b.name;
    }
    return b.name> a.name;
  });

  for (let i = 0; i < sortList.length; i++) {
    sortList[i].element.style.order = i;
  }
}



