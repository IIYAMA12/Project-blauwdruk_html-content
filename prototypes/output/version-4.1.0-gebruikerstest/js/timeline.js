function sortTimeline (oldNew) {
  const eventElements = document.getElementById("event-list").children;
  const eventList = [];
  for (let i = 0; i < eventElements.length; i++) {
    const eventElement = eventElements[i];
    eventList[eventList.length] = {
      element: eventElement,
      date: dataManager.getItemFromElement(eventElement) != undefined ? dataManager.getItemFromElement(eventElement).getData("date") : new Date()
    };
  }
  eventList.sort(function (a, b) {
    if (oldNew) {
      return a.date.getTime() > b.date.getTime();
    }
    return b.date.getTime() > a.date.getTime();
  });
  for (let i = 0; i < eventList.length; i++) {
    eventList[i].element.style.order = i;
  }
}

document.getElementById("order-timeline").addEventListener("change", function (e) {
  const source = e.target;
  
  const value = Number(source.options[source.selectedIndex].value);
  if (value === 0) {
    sortTimeline(true);
  } else {
    sortTimeline(false);
  }
});


function scrollToTimelineElement() {
  const item = dataManager.getItemFromElement(this);
  if (item != undefined) {
    scrollToTimelineElementByItem (item);
  }
}

function scrollToTimelineElementByItem (item) {
  const eventElements = document.getElementById("event-list").children;
  for (let i = 0; i < eventElements.length; i++) {
    const eventElement = eventElements[i];
    if (dataManager.getItemFromElement(eventElement) == item) {
      changeTab("tab-panel-main-content", 0);
      eventElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      closeDialog();
      scrollToElementHighlight(eventElement,"time-line-item__article");
      break;
    }
  }
}


