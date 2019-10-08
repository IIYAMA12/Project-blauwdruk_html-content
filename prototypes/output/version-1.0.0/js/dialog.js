let openDialog;
let closeDialog;
(function () {
  const dialogWrapper = document.getElementById("dialog-wrapper");




  openDialog = function (e) {
    dialogWrapper.classList.remove("hidden");

    const item = dataManager.getItemFromElement(this);
    const dialogLayouts = dialogWrapper.getElementsByClassName("dialog-layout");
    for (let i = 0; i < dialogLayouts.length; i++) {
      const dialogLayout = dialogLayouts[i];
      dialogLayout.classList.add("hidden");
    }

    if (item != undefined) {
      const groupName = item.parent.getData("name");
      if (groupName == "sources") {
        const baseDialog = document.getElementById("source-dialog");
        baseDialog.classList.remove("hidden");
        /*
          header title
        */
        baseDialog.getElementsByClassName("dialog-header")[0].children[0].children[1].textContent = item.getData("name");

        /*
          Properties
        */
        const propertiesContainer = baseDialog.getElementsByClassName("properties-container")[0];
        propertiesContainer.innerHTML = "";
        const propertyList = [{
          key: "firstname",
          friendlyName: "Naam:"
        }, {
          key: "email",
          friendlyName: "Email:"
        }, {
          key: "phonenumber",
          friendlyName: "Telefoonnummer:"
        }];
        const propertyTemplate = [];
        for (let i = 0; i < propertyList.length; i++) {
          const property = propertyList[i];
          const value = item.getData(property.key);

          if (value != undefined) {
            propertyTemplate[propertyTemplate.length] = {
              content: "div",
              type: "tag",
              children: [{
                  content: "p",
                  type: "tag",
                  data: {
                    attributes: [{
                      key: "class",
                      value: "p-label"
                    }]
                  },
                  child: {
                    content: property.friendlyName,
                    type: "text"
                  }
                },
                {
                  content: "p",
                  type: "tag",
                  child: {
                    content: value,
                    type: "text"
                  }
                }
              ]
            }
          }
        }
        templateEngine.render(propertyTemplate, propertiesContainer);

        const footer = baseDialog.getElementsByClassName("properties")[0].getElementsByTagName("footer")[0];
        const netwerkDBLink = item.getData("ftm-netwerk-database");
        console.log(netwerkDBLink);
        if (netwerkDBLink != undefined) {
          footer.getElementsByTagName("a")[0].textContent = netwerkDBLink;
          footer.classList.remove("hidden");
        } else {
          footer.classList.add("hidden");
        }

        /*
          references
        */

        const references = baseDialog.getElementsByClassName("references")[0];
        const referenceList = ["events", "connections", "research-questions"];

        const itemConnections = item.getConnections();
        if (itemConnections.length > 0) {
          
          for (let i = 0; i < referenceList.length; i++) {
            const referenceTemplate = [];
            const container = references.getElementsByClassName(referenceList[i])[0];
            const list = container.getElementsByTagName("ul")[0];

            list.innerHTML = "";
            
            if (true) {
              
              for (let j = 0; j < itemConnections.length; j++) {
                const itemConnection = itemConnections[j];
                if (dataManager.getConnectionGroup(itemConnection) == referenceList[i]) {
                  console.log(dataManager.getConnectionGroup(itemConnection), referenceList[i])
                  const connectedItems = dataManager.getConnectionItemsWithoutItem(itemConnection, item);
                  for (let k = 0; k < connectedItems.length; k++) {
                    const connectedItem = connectedItems[k];
                    console.log(connectedItem.parent.getData("group"));
                    if (connectedItem.parent.getData("group") && connectedItem.parent.getData("name") == referenceList[i]) {
                      referenceTemplate[referenceTemplate.length] = {
                        content: "li",
                        type: "tag",
                        child: {
                          content : function () {
                            const button = document.createElement("button");
                            button.setAttribute("type", "button");
                            button.classList.add("reference-button");
                            button.textContent = connectedItem.getData("name");
                            connectedItem.attachElement(button);
                            return button;
                          },
                          type: "function"
                        }
                      }
                    }
                  }
                }
              }
            }

            if (referenceTemplate.length > 0) {
              templateEngine.render(referenceTemplate, list);

              const referenceButtons = list.getElementsByClassName("reference-button");
              for (let j = 0; j < referenceButtons.length; j++) {
                const referenceButton = referenceButtons[j];
                if (referenceList[i] == "events") {
                  referenceButton.addEventListener("click", scrollToTimelineElement, false);
                }
                
              }
              
              container.classList.remove("hidden");
            } else {
              container.classList.add("hidden");
            }
          }
        }

      } else if (groupName == "documents") {
        const baseDialog = document.getElementById("document-dialog");
        baseDialog.classList.remove("hidden");
        baseDialog.getElementsByClassName("dialog-header")[0].children[0].children[1].textContent = item.getData("name");

        const propertiesContainer = baseDialog.getElementsByClassName("properties-container")[0];
        propertiesContainer.innerHTML = "";
        const propertyList = [
          {
            key: "link",
            friendlyName: "Link:"
          }, {
            key: "description",
            friendlyName: "Beschrijving:"
          }, {
            key: "reference",
            friendlyName: "Referentie:"
          }, {
            key: "document-status",
            friendlyName: "Document status:"
          }, {
            key: "validation-status",
            friendlyName: "Validatie status:"
          }, {
            key: "date-of-issue",
            friendlyName: "Uitgifte datum:"
          }, {
            key: "publisher",
            friendlyName: "Uitgever:"
          }
        ];
        
        const propertyTemplate = [];
        for (let i = 0; i < propertyList.length; i++) {
          const property = propertyList[i];
          const value = item.getData(property.key);

          if (value != undefined) {
            propertyTemplate[propertyTemplate.length] = {
              content: "div",
              type: "tag",
              children: [{
                  content: "p",
                  type: "tag",
                  data: {
                    attributes: [{
                      key: "class",
                      value: "p-label"
                    }]
                  },
                  child: {
                    content: property.friendlyName,
                    type: "text"
                  }
                },
                {
                  content: "p",
                  type: "tag",
                  child: {
                    content: value,
                    type: "html"
                  }
                }
              ]
            }
          }
        }
        templateEngine.render(propertyTemplate, propertiesContainer);


        const references = baseDialog.getElementsByClassName("references")[0];
        const referenceList = [{name:"events", type: "button"}, {name:"connections", type: "button"}, {name:"research-questions", type:"button"}];
        
        const screenshotSection = references.getElementsByClassName("screenshots")[0];
        const screenshotContainer = screenshotSection.getElementsByTagName("ul")[0];
        const screenshots = item.getData("screenshots");
        const screenshotTemplate = [];

        screenshotContainer.innerHTML = "";
        if (screenshots != undefined && screenshots.length > 0) {
          
          screenshotSection.classList.remove("hidden");
          for (let index = 0; index < screenshots.length; index++) {
            const screenshot = screenshots[index];
            screenshotTemplate[screenshotTemplate.length] = {
              content: "li",
              type: "tag",
              child: {
                content : function () {
                  const image = document.createElement("img");
                  image.setAttribute("src", "assets/documents/" + screenshot); 
                  return image;
                },
                type: "function"
              }
            }
          }
        } else {
          screenshotSection.classList.add("hidden");
        }
        templateEngine.render(screenshotTemplate, screenshotContainer);
        setScreenshotsViewAble(screenshotContainer);

        const itemConnections = item.getConnections();
        if (itemConnections.length > 0) {
          
          for (let i = 0; i < referenceList.length; i++) {
            const referenceTemplate = [];
            const container = references.getElementsByClassName(referenceList[i].name)[0];
            const list = container.getElementsByTagName("ul")[0];

            list.innerHTML = "";
            



            if (true) {
              
              for (let j = 0; j < itemConnections.length; j++) {
                const itemConnection = itemConnections[j];
                if (dataManager.getConnectionGroup(itemConnection) == referenceList[i].name) {
                  console.log(dataManager.getConnectionGroup(itemConnection), referenceList[i].name)
                  const connectedItems = dataManager.getConnectionItemsWithoutItem(itemConnection, item);
                  console.log(referenceList[i].type);
                  for (let k = 0; k < connectedItems.length; k++) {
                    const connectedItem = connectedItems[k];
                    // console.log(connectedItem.parent.getData("group"));
                    if (connectedItem.parent.getData("group") && connectedItem.parent.getData("name") == referenceList[i].name) {
                      if (referenceList[i].type == "button") {
                        referenceTemplate[referenceTemplate.length] = {
                          content: "li",
                          type: "tag",
                          child: {
                            content : function () {
                              const button = document.createElement("button");
                              button.setAttribute("type", "button");
                              button.classList.add("reference-button");
                              button.textContent = connectedItem.getData("name");
                              connectedItem.attachElement(button);
                              return button;
                            },
                            type: "function"
                          }
                        }
                      } else if (referenceList[i].type == "image") {
                        
                      }
                    }
                  }
                }
              }
            }

            if (referenceTemplate.length > 0) {
              templateEngine.render(referenceTemplate, list);

              const referenceButtons = list.getElementsByClassName("reference-button");
              for (let j = 0; j < referenceButtons.length; j++) {
                const referenceButton = referenceButtons[j];
                if (referenceList[i].name == "events") {
                  referenceButton.addEventListener("click", scrollToTimelineElement, false);
                }
                
              }
              
              container.classList.remove("hidden");
            } else {
              container.classList.add("hidden");
            }
          }
        }
      }
      

    }
    e.preventDefault();
  };

  const openButtons = document.getElementsByClassName("open-dialog");
  for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener("click", openDialog, false);
  }
  closeDialog = function () {
    dialogWrapper.classList.add("hidden");
    hideImageDialog ();
  };
  document.getElementById("close-dialog").addEventListener("click", closeDialog, false);
  dialogWrapper.addEventListener("click", function (e) {
    if (e.target === this) {
      closeDialog();
    }
  }, false);
})();