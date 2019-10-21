

function templatingConnectedButtons (configuration) {
  console.log(configuration)
  const item = configuration.data;
  const excluded = configuration.excluded || {};
  const elements = [];
  const connections = dataManager.getItemConnections(item);
  const connectionsFoundRegister = {};
  for (let i = 0; i < connections.length; i++) {
    const connection = connections[i];
    
    
    const connectionGroup = dataManager.getConnectionGroup(connection);
    
    if (connectionGroup == configuration.baseGroup) { // connectionGroup == "events"

      const connectedItems = dataManager.getConnectionItems(connection);
      for (let j = 0; j < connectedItems.length; j++) {
        const connectedItem = connectedItems[j];

        if (connectedItem !== item) {
          const typeOfData = connectedItem.parent.getData("name");
          if (!excluded[typeOfData] && typeOfData !== "connections") { // typeOfData == "sources" || typeOfData == "documents" && 
            if (connectionsFoundRegister[typeOfData] == undefined) {
              connectionsFoundRegister[typeOfData] = {
                count: 0,
                list:[]
              };
            }
            connectionsFoundRegister[typeOfData].count++;
            connectionsFoundRegister[typeOfData].list[connectionsFoundRegister[typeOfData].list.length] = connectedItem;
          }

        }
      }

      for (var typeOfData in connectionsFoundRegister) {
        if (connectionsFoundRegister.hasOwnProperty(typeOfData)) {
          const connectedItems = connectionsFoundRegister[typeOfData].list;
          const count = connectionsFoundRegister[typeOfData].count;

          const container = document.createElement("div");
          container.classList.add("connected-content-button-wrapper", "close");

          const button = document.createElement("button");
          container.appendChild(button);

          button.addEventListener("click", openConnectedContentList, false);
          container.addEventListener("mouseleave", closeConnectedContentList, false);

          button.setAttribute("type", "button");
          button.classList.add("connected-content-button");

          if (typeOfData == "sources") {
            button.classList.add("source");
          } else if (typeOfData == "documents") {
            button.classList.add("doc");
          }

          const screenReaderElement = document.createElement("span");
          const countElement = document.createElement("span");
          countElement.textContent = count + "x";
          button.appendChild(screenReaderElement);
          button.appendChild(countElement);

          const listElement = document.createElement("ul");
          for (let i = 0; i < connectedItems.length; i++) {
            const connectedItem = connectedItems[i];
            const itemElement = document.createElement("li");
            const button = document.createElement("button");
            button.classList.add("open-dialog");
            button.setAttribute("type", "button");
            button.textContent = connectedItem.getData("name");
            itemElement.appendChild(button);
            listElement.appendChild(itemElement);
            connectedItem.attachElement(button);
            button.addEventListener("click", openDialog, false);
          }
          container.appendChild(listElement);
          elements[elements.length] = container;
        }
      }
    }
  }
  return elements;
}