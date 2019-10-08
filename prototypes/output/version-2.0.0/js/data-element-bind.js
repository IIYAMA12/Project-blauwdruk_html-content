dataManager.attachElement = function (element, item) {
  const elements = item.elements;
  if (!elements.includes(element)) {
    elements[elements.length] = element;
    return true;
  }
};

dataManager.detachElement = function (element, item) {
  const elements = item.elements;
  if (elements.includes(element)) {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i] === element) {
        elements.splice(i, 1);
        return true;
      }
    }
  }
};

dataManager.clearDeletedElements = function (item) {
  const elements = item.elements;
  for (let i = elements.length - 1; i > -1; i--) {
    const element = elements[i];
    if (element.parent == null) {
      elements.splice(i, 1);
    }
  }
};

dataManager.getItemFromElement = function (element) {
  if (element != undefined) {
    const itemsList = this.items.list;
    for (let i = 0; i < itemsList.length; i++) {
      const item = itemsList[i];
      if (item.elements.includes(element)) {
        return item;
      }
    }
  }
};

dataManager.getAttachedElementsFromItem = function (element, item) {
  return item.elements;
};

(function() {
  const methodsList = dataManager.constructor.methodsList;
  methodsList[methodsList.length] = {
    key: "attachElement",
    func: function (element) {
      return dataManager.attachElement(element, this);
    }
  };
  methodsList[methodsList.length] = {
    key: "detachElement",
    func: function (element) {
      return dataManager.detachElement(element, this);
    }
  };
  methodsList[methodsList.length] = {
    key: "getAttachedElements",
    func: function () {
      return item.elements;
    }
  };
})();

