

/*
  Process data
*/
const dataBase = {};


const outputContainer = dataManager.addItem();

for (let i=0; i < dataBaseRaw.length; i++) {
  const group = dataBaseRaw[i];
  
  const groupContainer = dataManager.addItem(outputContainer);
  dataBase[group.key] = groupContainer;
  groupContainer.setData("group", true);
  groupContainer.setData("name", group.key);
  if (true) {
    let parent;

    if (group.elementId != undefined) {
      parent = document.getElementById(group.elementId);
      dataManager.attachElement(parent, groupContainer);
    }

    const items = group.items;
    for (let j=0; j < items.length; j++){
      
      const item = items[j];

      const itemNew = dataManager.addItem(groupContainer);
      

      for (let k=0; k < item.length; k++){
        const properties = item[k];
        itemNew.setData(properties.key, properties.value);
      }

      const connectionData = itemNew.getData("connections-with");
      if (connectionData != undefined) {
        for (let k=0; k < connectionData.length; k++){
          let connection = dataManager.getConnectionByName(connectionData[k].name);
          if (connection == undefined) {
            connection = dataManager.createItemConnection(connectionData[k].name);
            dataManager.setConnectionGroup(connection, connectionData[k].group);
          }
          
          itemNew.joinConnection(connection);
        }
      }
    }
  }
}


/*
  Draw info
*/
for (let i=0; i < dataBaseRaw.length; i++) {
  if (true) {
    const group = dataBaseRaw[i];
    const groupContainer = dataBase[group.key];
    let parent;

    if (group.elementId != undefined) {
      parent = document.getElementById(group.elementId);
    }
    for (let j=0; j < groupContainer.children.length; j++){
      const item = groupContainer.children[j];

      if (group.key === "sources") {
        const template = [
          {
            content: "li",
            type: "tag",
            child: {
              content: "a",
              type: "tag",
              data: {
                attributes: [
                  {
                    key: "class",
                    value: "open-dialog"
                  },
                  {
                    key: "href",
                    value: "#"
                  }
                ]
              },
              child: {
                content: "figure",
                type: "tag",
                children: [
                  {
                    content: "img",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "src",
                          value: "assets/bron.svg"
                        },
                        {
                          key: "alt",
                          value: item.getData("name")
                        }
                      ]
                    }
                  },
                  {
                    content: "figcaption",
                    type: "tag",
                    child: {
                      content: item.getData("name"),
                      type: "text"
                    }
                  }
                ]
              }
            }
          }
        ];
        templateEngine.render(template, parent);
        console.log(template);
        dataManager.attachElement(template[0].elements[0], item);
        dataManager.attachElement(template[0].child.elements[0], item);
        template[0].child.elements[0].addEventListener("click", openDialog, false);
      } else if (group.key === "documents") {
        const template = [
          {
            content: "li",
            type: "tag",
            child: {
              content: "a",
              type: "tag",
              data: {
                attributes: [
                  {
                    key: "class",
                    value: "open-dialog"
                  },
                  {
                    key: "href",
                    value: "#"
                  }
                ]
              },
              child: {
                content: "figure",
                type: "tag",
                children: [
                  {
                    content: "img",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "src",
                          value:  item.getData("screenshots") != undefined ? "assets/documents/" + item.getData("screenshots")[0] : "assets/document.svg"
                        },
                        {
                          key: "alt",
                          value: item.getData("name")
                        },
                        {
                          key: "class",
                          value: item.getData("screenshots") != undefined ? "screenshot" : ""
                        }

                      ]
                    }
                  },
                  {
                    content: "p",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "class",
                          value: "format"
                        }
                      ]
                    },
                    child: {
                      content: item.getData("file-extension") || "PDF",
                      type: "text"
                    }
                  },
                  {
                    content: "figcaption",
                    type: "tag",
                    child: {
                      content: item.getData("name"),
                      type: "text"
                    }
                  }
                ]
              }
            }
          }
        ];
        templateEngine.render(template, parent);
        dataManager.attachElement(template[0].elements[0], item);
        dataManager.attachElement(template[0].child.elements[0], item);
        template[0].child.elements[0].addEventListener("click", openDialog, false);
      } else if (group.key === "events") {
        const date = item.getData("date");
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const month = monthIndex + 1;
        const year = date.getFullYear();

        const template = [
          {
            content: "li",
            type: "tag",
            data: {
              attributes: [
                {
                  key: "class",
                  value: "time-line-item"
                }
              ]
            },
            children: [
              {
                content: "p",
                type: "tag",
                data: {
                  attributes: [
                    {
                      key: "class",
                      value: "time-line-item__date-year"
                    }
                  ]
                },
                child: {
                  content: year,
                  type: "text"
                }
              },
              {
                content: "article",
                type: "tag",
                data: {
                  attributes: [
                    {
                      key: "class",
                      value: "time-line-item__article"
                    }
                  ]
                },
                children: [
                  {
                    content: "img",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "class",
                          value: "time-line-item__arrow"
                        },
                        {
                          key: "aria-hidden",
                          value: "true"
                        },
                        {
                          key: "src",
                          value: "assets/tijd-line-pijl.svg"
                        }
                      ]
                    }
                  },
                  {
                    content: "p",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "class",
                          value: "time-line-item__full-date"
                        }
                      ],
                    },
                    child: {
                      content: "Datum: " + day + "-" + month + "-" + year,
                      type: "text"
                    }
                  },
                  {
                    content: "div",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "class",
                          value: "padding-box"
                        }
                      ],
                    },
                    children: [
                      {
                        content: "div",
                        type: "tag",
                        children: [
                          {
                            content: "h3",
                            type: "tag",
                            child: {
                              content: item.getData("name"),
                              type: "text"
                            }
                          },
                          {
                            content: "p",
                            type: "tag",
                            child: {
                              content: item.getData("description"),
                              type: "text"
                            },
                          }
                        ]
                      },
                      {
                        content: "section",
                        type: "tag",
                        data: {
                          attributes: [
                            {
                              key: "class",
                              value: "connected-content"
                            }
                          ],
                        },
                        child: {
                          content: templatingConnectedButtons,
                          type: "function",
                          data: {data: item, baseGroup:"events", excluded:{events:true}}
                        }
                      }
                    ]
                  },
                  {
                    content: "div",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          key: "class",
                          value: "connector"
                        }
                      ],
                    },
                    child: {
                      content: "div",
                      type: "tag",
                      data: {
                        attributes: [
                          {
                            key: "class",
                            value: "inner"
                          }
                        ],
                      },
                    }
                  }
                ]
              }
            ]
          }
        ];
        templateEngine.render(template, parent);

        
        dataManager.attachElement(template[0].elements[0], item);
        item.setData("timeline-element", template[0].elements[0])
      } else if (group.key === "research-questions") {
        const template = [
          {
            content: "li",
            type: "tag",
            data: {
              attributes: [
                {
                  value: "research-question-item",
                  key: "class"
                }
              ]
            },
            children: [
              {
                content: "article",
                type: "tag",
                data: {
                  attributes: [
                    {
                      value: "research-question-main-article",
                      key: "class"
                    }
                  ]
                },
                children: [
                  {
                    content: "div",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          value: "research-question-question-answer-wrapper",
                          key: "class"
                        }
                      ]
                    },
                    children: [
                      {
                        content: "article",
                        type: "tag",
                        children: [
                          
                          {
                            content: "h3",
                            type: "tag",
                            child: {
                              content: "Onderzoeksvraag",
                              type: "text"
                            }
                          },
                          {
                            content: "p",
                            type: "tag",
                            child: {
                              content: item.getData("question"),
                              type: "text"
                            }
                          },
                          {
                            content: "div",
                            type: "tag",
                            children: [], // to-do
                            data: {
                              attributes: [
                                {
                                  value: "connected-content",
                                  key: "class"
                                }
                              ]
                            }
                          },
                          {
                            content: "details",
                            type: "tag",
                            children: [
                              {
                                content: "summary",
                                type: "tag",
                                child: {
                                  content: "Aanleiding",
                                  type: "text"
                                }
                              },
                              {
                                content: "p",
                                type: "tag",
                                child: {
                                  content: item.getData("motive"),
                                  type: "text"
                                }
                              },
                              {
                                content: "div",
                                type: "tag",
                                children: [], // to-do
                                data: {
                                  attributes: [
                                    {
                                      value: "connected-content",
                                      key: "class"
                                    }
                                  ]
                                }
                              }
                            ]
                          },
                          {
                            content: "details",
                            type: "tag",
                            children: [
                              {
                                content: "summary",
                                type: "tag",
                                child: {
                                  content: "Doel",
                                  type: "text"
                                }
                              },
                              {
                                content: "p",
                                type: "tag",
                                child: {
                                  content: item.getData("goal"),
                                  type: "text"
                                }
                              },
                              {
                                content: "div",
                                type: "tag",
                                children: [], // to-do
                                data: {
                                  attributes: [
                                    {
                                      value: "connected-content",
                                      key: "class"
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        ]
                      },
                      
                      {
                        content: "article",
                        type: "tag",
                        children: [
                          {
                            content: "h3",
                            type: "tag",
                            child: {
                              content: "Beantwoording",
                              type: "text"
                            }
                          },
                          {
                            content: "div",
                            type: "tag",
                            data: {
                              attributes: [
                                {
                                  value: "question-list-wrapper scroll-box-white",
                                  key: "class"
                                }
                              ]
                            },
                            children: [
                              {
                                content: "ul",
                                type: "tag",
                                data: {
                                  attributes: [
                                    {
                                      value: "question-list",
                                      key: "class"
                                    }
                                  ]
                                },
                                children: [
                                  {
                                    content: function () {
                                      const listItems = [];
                                      const answers = item.getData("answers");
                                      if (answers != undefined) {
                                        for (let i = 0; i < answers.length; i++) {
                                          const answer = answers[i];
                                          const listItemElement = document.createElement("li");
                                          const paragraph = document.createElement("p");
                                          listItemElement.appendChild(paragraph);
                                          listItemElement.classList.add("question-list-item")
                                          paragraph.textContent = answer.value;

                                          

                                          const tags = answer.tags;
                                          if (tags != undefined) {
                                            const tagList = document.createElement("ul");
                                            
                                            for (let j = 0; j < tags.length; j++) {
                                              const tag = tags[j];
                                              const tagListItemElement = document.createElement("li");
                                              const tagElement = document.createElement("div");
                                              // tagElement.setAttribute("type", "button");
                                              tagElement.classList.add("tag");
                                              tagListItemElement.appendChild(tagElement);
                                              tagElement.textContent = tag;
                                              tagList.appendChild(tagListItemElement);
                                            }
                                            

                                            listItemElement.appendChild(tagList);
                                          }
                                          
                                          listItems[listItems.length] = listItemElement;
                                        }
                                      }

                                    return listItems;
                                    },
                                    type: "function"
                                  }
                                  
                                ]
                              },
                              
                            ]
                          },
                          {
                            content: "section",
                            type: "tag",
                            data: {
                              attributes: [
                                {
                                  value: "connected-content",
                                  key: "class"
                                }
                              ],
                            },
                            child: {
                            content: templatingConnectedButtons,
                            type: "function",
                              data: {data: item, baseGroup:"research-questions"} // , excluded:{events:true}
                            }
                            
                          }
                        ]
                      }
                    ]
                  },
                  {
                    content: "footer",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          value: "research-question-question-footer",
                          key: "class"
                        }
                      ]
                    },
                    children: [
                      
                      
                    ]
                  }
                ]
              },
              {
                content: "button",
                type: "tag",
                data: {
                  attributes: [
                    {
                      value: "research-question-question-show-more",
                      key: "class"
                    },
                    {
                      value: "button",
                      key: "type"
                    }
                  ]
                },
                children: [
                  {
                    content: "span",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          value: "options",
                          key: "class"
                        }
                      ]
                    },
                    children: [
                      {
                        content: "span",
                        type: "tag",
                        data: {
                          attributes: [
                            {
                              value: "show-more",
                              key: "class"
                            }
                          ]
                        },
                        child: {
                          content: "Toon meer",
                          type: "text"
                        }
                      },
                      {
                        content: "span",
                        type: "tag",
                        data: {
                          attributes: [
                            {
                              value: "show-less",
                              key: "class"
                            }
                          ]
                        },
                        child: {
                          content: "Toon minder",
                          type: "text"
                        }
                      }
                    ]
                  },
                  {
                    content: "div",
                    type: "tag",
                    data: {
                      attributes: [
                        {
                          value: "button-icon",
                          key: "class"
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ];

        templateEngine.render(template, parent);

        const researchQuestionItems = parent.getElementsByClassName("research-question-item");

        if (researchQuestionItems.length > 0) {
          Array.from(researchQuestionItems).forEach(function (researchQuestionItem) {
            log(researchQuestionItem.getElementsByClassName("question-list-item").length)
            if (researchQuestionItem.getElementsByClassName("question-list-item").length < 3 ) {
              log(researchQuestionItem.getElementsByClassName("research-question-question-show-more")[0])
              researchQuestionItem.getElementsByClassName("research-question-question-show-more")[0].classList.add("hidden");
            }
          });
        }
        dataManager.attachElement(template[0].elements[0], item);
      }
    }
  }
}



window.addEventListener("load", function () {
  sortListOnKey(document.getElementById("sources-container"), "name", true)
  sortListOnKey(document.getElementById("document-container"), "name", true)
  sortTimeline (true);
  renderConnectionGraph ();
}, false);
