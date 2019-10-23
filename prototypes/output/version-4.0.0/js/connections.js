let svgToSpinView;
let svgTimeView;

/* 
  Inspiration from: https://www.d3-graph-gallery.com/graph/network_basic.html
*/
const margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 1336 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

let graphViewMode = "time";

const connectionGraphContainer = document.getElementById("connections-graph-container");
const svgRoot = d3.select(connectionGraphContainer)
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("xmlns", "http://www.w3.org/2000/svg");

svgRoot.node().setAttribute("viewBox","0 0 " + (width + margin.left + margin.right) +  " " +  (height + margin.top + margin.bottom));





  


const defs =  svgRoot.append("defs");

defs.append("marker")
    .attr("id", "svgheadarrow")
    .call(function (D3_element) {

      element = D3_element.node();
      element.setAttribute("viewBox","0 0 10 10");
      element.setAttribute("refX","1");
      element.setAttribute("refY","5");
      element.setAttribute("markerUnits","strokeWidth");
      element.setAttribute("markerWidth","10");
      element.setAttribute("markerHeight","10");
      element.setAttribute("orient", "auto");
    }).append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "rgb(41, 47, 50)")
;

defs.append("marker")
    .attr("id", "svgheadarrow-hover")
    .call(function (D3_element) {

      element = D3_element.node();
      element.setAttribute("viewBox","0 0 10 10");
      element.setAttribute("refX","1");
      element.setAttribute("refY","5");
      element.setAttribute("markerUnits","strokeWidth");
      element.setAttribute("markerWidth","3.333");
      element.setAttribute("markerHeight","3.333");
      element.setAttribute("orient", "auto");
    }).append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "red")
;

defs.append("marker")
    .attr("id", "svgheadarrow-white")
    .call(function (D3_element) {

      element = D3_element.node();
      element.setAttribute("viewBox","0 0 10 10");
      element.setAttribute("refX","1");
      element.setAttribute("refY","5");
      element.setAttribute("markerUnits","strokeWidth");
      element.setAttribute("markerWidth","3.333");
      element.setAttribute("markerHeight","3.333");
      element.setAttribute("orient", "auto");
    }).append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "white")
;


const svg = svgRoot
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        // svg.call(function(D3_element) {
        //   console.log(D3_element);
        //   D3_element.node().setAttribute("marker-end","url(#svgheadarrow)");
        // })

// Draw the axis
let axis;

      
function renderConnectionGraph () {

  const data = {
    nodes: [],
    links: []
  };

  const connection = dataManager.getConnectionByName("connection-34y2tfwd");
  const rawConnectionChildren = dataManager.getConnectionItems(connection);
  let connectionInfo;
  const connectionChildren = [];
  for (let i = 0; i < rawConnectionChildren.length; i++) {
    const item = rawConnectionChildren[i];
    if (item.parent.getData("name") == "connections") {
      connectionInfo = item;
      
    } else {
      connectionChildren[connectionChildren.length] = item;
    }
  }

  const nodes = data.nodes;
  const links = data.links;

  const connectionIdToItem = {};

  for (let i = 0; i < connectionChildren.length; i++) {
    const item = connectionChildren[i];
    nodes[nodes.length] = {
      id: item.id,
      name: item.getData("name"),
      item: item
    };

    connectionIdToItem[item.getData("connection-id")] = item;

    let item2 = connectionChildren[i + 1];
    if (item2 == undefined) {
      item2 = connectionChildren[0];
    }
    if (i < connectionChildren.length - 1) {
      // links[links.length] = {
      //   "source": item.id,
      //   "target": item2.id
      // };
    }
  }

  const relations = connectionInfo.getData("connections-with").filter(function (d) {
    if (d.group == "connections") {
      return true;
    }
    return false;
  })[0].relations;
  
  if (typeof(relations) == "object") {
    for (let i = 0; i < relations.length; i++) {
      const relation = relations[i];
      
      
      const item1 = connectionIdToItem[relation.a];
      const item2 = connectionIdToItem[relation.b];
      if (item1 != undefined && item2 != undefined) {
        links[links.length] = {
          name: relation.name,
          description: relation.description,
          source: item1.id,
          target: item2.id,
          sourceData: item1,
          targetData: item2,
          item: relation,
        };
      }
    }
  }

  const eventListConnections = document.getElementById("event-list-connections");
  if (eventListConnections != undefined) {
    const eventListConnections_d3 = d3.select(eventListConnections);
    


    const line = eventListConnections_d3.selectAll(".line").data(data.links).enter().append("path").attr("class", "line");

    line.each(function (d) {
      d.line = this;
    });
    
    const lineBox = eventListConnections_d3.selectAll(".line-box").data(data.links).enter().append("path").attr("class", "line-box");

    lineBox.each(function (d) {
      d.lineBox = this;
      d3.select(this).append("title").text("Ga naar verband: " + (d.name || ""));
    });

    const labelBackground = eventListConnections_d3.selectAll(".label-background").data(data.links).enter().append("rect").attr("class", "label-background").attr("x", 10).attr("y", 0).attr("width", 0).attr("height", 0);

    labelBackground.each(function (d) {
      d.labelBackground = this;
      d3.select(this).append("title").text("Ga naar verband: " + (d.name || ""));
    });

    const label = eventListConnections_d3.selectAll(".label").data(data.links).enter().append("text").attr("class", "label").text(function(d) {
      return d.item.name;
    }).attr("x", 20).attr("y", 0);

    let lastEventListHoveredElements = [];

    const unFocus = function () {
      for (let i = 0; i < lastEventListHoveredElements.length; i++) {
        lastEventListHoveredElements[i].classList.remove("hover")
      }
    };

    const hoverEffect = function (d) {
      unFocus();
      lastEventListHoveredElements = [];
      const timelineSourceElement = d.sourceData.getData("timeline-element");
      if (timelineSourceElement != undefined) {
        timelineSourceElement.getElementsByClassName("inner")[0].classList.add("hover");
        lastEventListHoveredElements[lastEventListHoveredElements.length] = timelineSourceElement.getElementsByClassName("inner")[0];
      }

      const timelineTargetElement = d.targetData.getData("timeline-element");
      if (timelineTargetElement != undefined) {
        timelineTargetElement.getElementsByClassName("inner")[0].classList.add("hover");
        lastEventListHoveredElements[lastEventListHoveredElements.length] = timelineTargetElement.getElementsByClassName("inner")[0];
      }

      d.line.classList.add("hover");
      d.labelBackground.classList.add("hover");
      
      lastEventListHoveredElements[lastEventListHoveredElements.length] = d.line;
      lastEventListHoveredElements[lastEventListHoveredElements.length] = d.labelBackground;
    };



    labelBackground.on("mouseover", function (d) {
      hoverEffect(d);
    });

    labelBackground.on("mouseout", function (d) {
      unFocus();
    });


    lineBox.on("mouseover", function (d) {
      hoverEffect(d);
    });

    lineBox.on("mouseout", function (d) {
      unFocus();
    });


    labelBackground.on("click", function (d) {
      changeTab("tab-panel-main-content", 1);
      showConnectionDetails (d, d.linkContainer);
    });

    lineBox.on("click", function (d) {
      changeTab("tab-panel-main-content", 1);
      showConnectionDetails (d, d.linkContainer);
    });
    
    const prepareParameters = function (d) {
      const timelineSourceElement = d.sourceData.getData("timeline-element");
      const boundingBoxSourceElement = timelineSourceElement.getElementsByClassName("inner")[0].getBoundingClientRect();

      const timelineTargetElement = d.targetData.getData("timeline-element");
      const boundingBoxtimelineTargetElement = timelineTargetElement.getElementsByClassName("inner")[0].getBoundingClientRect();

      const topOffsetSourceElement = boundingBoxSourceElement.height / 2 + boundingBoxSourceElement.top - timelineSourceElement.parentElement.getBoundingClientRect().top + timelineSourceElement.parentElement.scrollTop;//(window.scrollY || window.pageYOffset);
      const topOffsetTargetElement = boundingBoxtimelineTargetElement.height / 2 + boundingBoxtimelineTargetElement.top - timelineTargetElement.parentElement.getBoundingClientRect().top + timelineTargetElement.parentElement.scrollTop; //(window.scrollY || window.pageYOffset);

      let offsetSide = (eventListConnections.getBoundingClientRect().width - 10) * (topOffsetTargetElement - topOffsetSourceElement) / 600;
      if (offsetSide < 0) {
        offsetSide = -offsetSide;
      }

      return {
        timelineSourceElement: timelineSourceElement,
        boundingBoxSourceElement: boundingBoxSourceElement,
        topOffsetSourceElement: topOffsetSourceElement,
        topOffsetTargetElement: topOffsetTargetElement,
        offsetSide: offsetSide,
        containerWidth: eventListConnections.getBoundingClientRect().width
      };
    };

    let lastEventListOrientation = {

    };


    let requestID;

    const updateTimelineConnections = function () {
      const forceUpdate = true;
      
      const eventListConnectionsBox = eventListConnections.getBoundingClientRect();
      if (eventListConnectionsBox != undefined && (eventListConnectionsBox.width !== lastEventListOrientation.width || eventListConnectionsBox.height !== lastEventListOrientation.height || forceUpdate)) {
        lastEventListOrientation.width = eventListConnectionsBox.width;
        lastEventListOrientation.height = eventListConnectionsBox.height;

        line.each(function (d) {
          const parameters = prepareParameters(d);
          d3.select(this).transition()
            .attr("d", "M0," + parameters.topOffsetSourceElement + " C"+ parameters.offsetSide +"," + parameters.topOffsetSourceElement + " " + parameters.offsetSide + "," +  parameters.topOffsetTargetElement + " 0," + parameters.topOffsetTargetElement );
          d.exactLineBoxWidth = this.getBBox().width;
        });
    
        lineBox.each(function (d) {
          const parameters = prepareParameters(d);
          d3.select(this).transition()
          .attr("d", "M0," + parameters.topOffsetSourceElement + " C"+ parameters.offsetSide +"," + parameters.topOffsetSourceElement + " " + parameters.offsetSide + "," +  parameters.topOffsetTargetElement + " 0," + parameters.topOffsetTargetElement );
        });
    
    
        label.each(function (d) {
          const parameters = prepareParameters(d);
          const containerWidth = parameters.containerWidth - 20;
          let textParts = d.name.split(" ");
          let labelText = textParts[0];
          let previousLabelText = labelText;
          let labelWidth = 0;
          let previousLabelWidth = containerWidth;
          

          for (let i = 1; i < textParts.length; i++) {
            const textPart = textParts[i];
            
            labelText +=  " " + textPart;

            d3.select(this).text(labelText);
            labelWidth = this.getBoundingClientRect().width;
            if (labelWidth > containerWidth) {
              d3.select(this).text(previousLabelText + " ...");
              labelWidth = Math.max(previousLabelWidth, this.getBoundingClientRect().width);
            } else {
              previousLabelText = labelText;
              previousLabelWidth = labelWidth;
            }
          }
          labelWidth = this.getBoundingClientRect().width;

          d3.select(this).attr("x", Math.min(d.exactLineBoxWidth + labelWidth - 20, parameters.containerWidth -  10))

          d3.select(this).attr("y", parameters.topOffsetSourceElement + (parameters.topOffsetTargetElement - parameters.topOffsetSourceElement) / 2);
          
          d.textLabelWidth =  labelWidth;
        });

        labelBackground.each(function (d) {
          const parameters = prepareParameters(d);
          d3.select(this).attr("y", parameters.topOffsetSourceElement + (parameters.topOffsetTargetElement - parameters.topOffsetSourceElement) / 2 - 21)
          d3.select(this).attr("height", 32);
          d3.select(this).attr("width", d.textLabelWidth + 30);

          d3.select(this).attr("x", Math.min((d.exactLineBoxWidth - 30), (parameters.containerWidth - d.textLabelWidth - 20)));
        });
      }
      requestID = undefined;
    };


    setInterval(
      function () {
        if (requestID != undefined) {
          window.cancelAnimationFrame(requestID);
        }
        requestID = window.requestAnimationFrame(updateTimelineConnections);
      }, 500);
  }

  // Initialize the links
  const link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("path")
    .attr("class", "bounding-box-line")
  ;

  link.each(function (d) {
    d.linkContainer = this;
  });
      // const getDataFromLine = function (e) {
      //   console.log(e.target);
      // };
  
  // const link = svg

  // link
  //   .each(function(d) {
  //     this.addEventListener("click", getDataFromLine, false);
  //   })
  // ;

  // Initialize the nodes
  const node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", "event-nodes")
    .style("fill", "#292F32");
  
  node
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0)
    .attr("class","time-bind-line")
  ;

  const showDate = node
    .append("g")
    .attr("class", "show-date")
  ;

  showDate
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 0)
    .attr("height", "24")
    .attr("class", "date-background")
  ;
  showDate
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("class", "date-text")
  ;

  node
    .append("circle")
      .attr("r", 15)
  ;





  const labelType = svg
  .selectAll(".svg-type-label")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("class", "svg-type-label")
    .text("Gebeurtenis")
  ;

  const labelName = node
    // .selectAll(".svg-name-label")
      .append("text")
      .attr("class", "svg-name-label")
      .text(function (d) {
        return d.name;
      })
  ;



  // Let's list the force we wanna apply on the network
  const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-10000))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);



  
  const distanceFromNode = 25;
  const distanceFromNodeArrow = 35;

  function showConnectionDetails (d, element) {
    if (d != undefined) {
      const activeElements = svgRoot.node().getElementsByClassName("active-element");
      for (let i = 0; i < activeElements.length; i++) {
        const activeElement = activeElements[i];
        activeElement.classList.remove("active-element");
      }
        
      

      if (element != undefined) {
        element.classList.add("active-element");
      }

      const connectionDetails = document.getElementsByClassName("connection-details")[0];
      if (connectionDetails != undefined) {
        connectionDetails.classList.remove("hidden");
        if (connectionDetails.getElementsByClassName("connection-details__header")[0] != undefined) {
          connectionDetails.getElementsByClassName("connection-details__header")[0].textContent = d.name;
        }
        if (connectionDetails.getElementsByClassName("connection-details__description")[0] != undefined) {
          connectionDetails.getElementsByClassName("connection-details__description")[0].textContent = d.description;
        }
        const toInfoContainer = connectionDetails.getElementsByClassName("connection-details__to-info-container")[0];
        if (toInfoContainer != undefined) {
          toInfoContainer.classList.add("hidden");
        }
        
        const connectedContent = connectionDetails.getElementsByClassName("connected-content")[0];
        if (connectedContent != undefined) {
          connectedContent.innerHTML = "";
          const item = d.item;
          templateEngine.render(
            [

                {
                  content: templatingConnectedButtons,
                  type: "function",
                  data: {data: item, excluded:{events:true}, baseGroup:"events"} // 
                }
              
              ], connectedContent);
        }
        connectionDetails.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }
    } else {
      connectionDetails.classList.add("hidden");
    }
  }

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    connectionGraphContainer.classList.remove("loading");




    link
    .attr("d",
      function(d) {
        let x1 = d.source.x;
        let y1 = d.source.y;
        let x2 = d.target.x;
        let y2 = d.target.y;
        const distance = getDistanceBetweenPoints2D(x2, y2, x1, y1);
        const posX1 = extendLine2D(x2, y2, x1, y1, distance - distanceFromNode)[0];
        const posY1 = extendLine2D(x2, y2, x1, y1, distance - distanceFromNode)[1];
        const posX2 = extendLine2D(x1, y1, x2, y2, distance - distanceFromNodeArrow)[0];
        const posY2 = extendLine2D(x1, y1, x2, y2, distance - distanceFromNodeArrow)[1];
        return "M" + posX1 + "," + posY1 + " " + posX2 + "," + posY2; // M100,200 C100,100 400,100 400,200
      })
      .on("click", function (d, i) {
        // use d
        if (d != undefined) {
          showConnectionDetails (d, this);
        }
          
      })
      ;

    const domLinks = link.nodes();
    for (let i = 0; i < domLinks.length; i++) {
      const domLink = domLinks[i];
      
      const copyOfdomLink = domLink.cloneNode(false);

      domLink.parentElement.insertBefore(copyOfdomLink, domLink);
      domLink.parentElement.insertBefore(domLink, copyOfdomLink);

      copyOfdomLink.classList.add("line-effect");
      copyOfdomLink.classList.remove("bounding-box-line");
      const data = d3.select(domLink).data();
      data[0].copyOfdomLink = copyOfdomLink;
    }

    link.append("title").text(function (d) {
      return d.name;
    });

    let connectionDetailsButton;
    (function() {
      const button =  document.getElementsByClassName("connection-details")[0].getElementsByClassName("connection-details__to-info")[0];
      button.addEventListener("click", function() {
        const item = dataManager.getItemFromElement(this);
        if (item != undefined) {
          scrollToTimelineElementByItem (item);
        }
      });
    })();
   

    node
        .each(
          function (d) {
            d3.select(this).select("circle")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
          }
        )
        .on("click", function (d) {
          const item = d.item;
          if (d != undefined) {

            const activeElement = svgRoot.node().getElementsByClassName("active-element")[0];
            if (activeElement != undefined) {
              activeElement.classList.remove("active-element");
            }
            this.classList.add("active-element");

            const connectionDetails = document.getElementsByClassName("connection-details")[0];
            if (connectionDetails != undefined) {
              connectionDetails.classList.remove("hidden");
              if (connectionDetails.getElementsByClassName("connection-details__header")[0] != undefined) {
                connectionDetails.getElementsByClassName("connection-details__header")[0].textContent = d.name;
              }
              if (connectionDetails.getElementsByClassName("connection-details__description")[0] != undefined) {
                connectionDetails.getElementsByClassName("connection-details__description")[0].textContent = item.getData("description");
              }

              const toInfoContainer = connectionDetails.getElementsByClassName("connection-details__to-info-container")[0];
              if (toInfoContainer != undefined) {
                const parentName = item.parent.getData("name");
                if (parentName == "events") {
                  toInfoContainer.classList.remove("hidden");
                  const button = toInfoContainer.getElementsByClassName("connection-details__to-info")[0];
                  if (button != undefined) {
                    button.textContent = "Ga naar gebeurtenis in tijdlijn";
                    const previousItem = dataManager.getItemFromElement(button);
                    if (previousItem) {
                      dataManager.detachElement(button, previousItem);
                    }
                   
                    dataManager.attachElement(button, item);
                  }

                } else {
                  toInfoContainer.classList.add("hidden");
                }
              }
             
              const connectedContent = connectionDetails.getElementsByClassName("connected-content")[0];
              
              if (connectedContent != undefined) {
                connectedContent.innerHTML = "";
                templateEngine.render(
                  [

                      {
                        content: templatingConnectedButtons,
                        type: "function",
                        data: {data: item, excluded:{events:true}, baseGroup:"events"}
                      }
                    
                    ], connectedContent);
              }

              connectionDetails.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            }
          } else {
            connectionDetails.classList.add("hidden");
          }
        })
    ;
    

    
        


    labelName
      .attr("x", function (d) { return d.x; })
      .attr("y", function(d) { return d.y - 25; })
    ;

    labelType
      .attr("x", function (d) { return d.x; })
      .attr("y", function(d) { return d.y - 40; })
    ;
    if (graphViewMode == "time") {
      svgTimeView();
    }
  }

  svgToSpinView = function () {
    connectionGraphContainer.classList.remove("timeview");
    node
      .each(
        function (d) {
          d3.select(this).select("circle")
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
        }
      )
    ;

    link
      .attr("d",
      function(d) {
        let x1 = d.source.x;
        let y1 = d.source.y;
        let x2 = d.target.x;
        let y2 = d.target.y;
        const distance = getDistanceBetweenPoints2D(x2, y2, x1, y1);
        const posX1 = extendLine2D(x2, y2, x1, y1, distance - distanceFromNode)[0];
        const posY1 = extendLine2D(x2, y2, x1, y1, distance - distanceFromNode)[1];
        const posX2 = extendLine2D(x1, y1, x2, y2, distance - distanceFromNodeArrow)[0];
        const posY2 = extendLine2D(x1, y1, x2, y2, distance - distanceFromNodeArrow)[1];
        const path = "M" + posX1 + "," + posY1 + " " + posX2 + "," + posY2; // M100,200 C100,100 400,100 400,200
        d.copyOfdomLink.setAttribute("d", path);
        return path;
      })

    labelName
        .attr("x", function (d) { return d.x; })
        .attr("y", function(d) { return d.y - 25; })
      ;

    labelType
      .attr("x", function (d) { return d.x; })
      .attr("y", function(d) { return d.y - 40; })
    ;


  }
  const posY = height * 0.6666;
  svgTimeView = function () {
    connectionGraphContainer.classList.add("timeview");
    const nodeCount = node.nodes().length;
    // width = 1336 - margin.left
    const spacing  = width / nodeCount;
    
    const dates = nodes.reduce(function (accumulator, currentValue, currentIndex, array) {
      accumulator[accumulator.length] = currentValue.item.getData("date");
      return accumulator;
    }, 
    []
    );

    const scaleTime = d3.scaleLinear()
      .domain([d3.min(dates), d3.max(dates)]);
    
      
      

    const formatDate = d3.timeFormat("%d-%m-%Y");
    node
      .each(
        function (d) {
          const selectedNodes = d3.select(this);
          

          selectedNodes.select("circle")
          .attr("cx", function (d, i) { 
            return spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + spacing / 2; 
          })
          .attr("cy", posY);

          selectedNodes.select(".time-bind-line")
          .attr("x1", function (d, i) { 
            return spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + spacing / 2; 
          })
          .attr("x2", function (d, i) { 
            return spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + spacing / 2; 
          })
          .attr("y1", posY)
          .attr("y2", posY + 143)
        ;

          const showDate = selectedNodes.select(".show-date");
          

          const dateBackground = showDate.select(".date-background");
          const dateText = showDate.select(".date-text");
      
          
          dateText
            .text(function (d) {
              return formatDate(d.item.getData("date"));
            })
            .attr("x", function (d) {
              return spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + spacing / 2;
            })
            .attr("y", posY + 122)
          ;
          
          showDate.style("display", "inline");

          const box = dateText.node().getBBox();
          const dateTextWidth = box.width;

          showDate.style("display", "");

          dateBackground
            .attr("x", function (d) {
              return (spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + spacing / 2) - (dateTextWidth / 2) - 4;
            })
            .attr("y", posY + 104)
            .attr("width", dateTextWidth + 8)
          ;

        }
      )
    ;

    link
      .attr("d",
      function(d) {
        const posX1 = spacing * (nodeCount-1) * scaleTime(d.source.item.getData("date")) + spacing / 2;
        const posX2 = spacing * (nodeCount-1) * scaleTime(d.target.item.getData("date")) + spacing / 2;
        const bounce = 10 + Math.min((posX2 - posX1) * 0.3, 140);
        const path = "M" + posX1 + "," + posY + " C" + posX1 + "," + (posY + bounce) + " " + posX2  + "," + (posY + bounce) + " " + posX2 + "," + posY; // M100,200 C100,100 400,100 400,200
        d.copyOfdomLink.setAttribute("d", path);
        return path;
      })
    ;

    labelName
      .attr("x", function (d) { 
        // return d.x; 
        const box = this.getBBox();
        return spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + box.width / 2 + spacing / 2; 
      })
      .attr("y", function(d) { return posY - 20; })
      .style("transform-origin", function(d) {
        const box = this.getBBox();
        //
        
        const posX = spacing * (nodeCount-1) * scaleTime(d.item.getData("date")) + spacing / 2; 
        return posX + "px " + (posY - 20 + box.height) + "px" ;
      });
    ;

    

    labelType
      .attr("x", function (d) { return d.x; })
      .attr("y", function(d) { return posY - 40; })
    ;

    axis = svg
      .append("g")
      .attr("class", "time-line-axis");

    const axisScale = scaleTime.range([0, spacing * (nodeCount-1)]);       
    
    axis.call(d3.axisBottom(axisScale).tickPadding(10).tickSize(10, 0).tickFormat(d3.timeFormat("%d-%m-%Y"))); //d3.timeFormat("%Y-%m-%d")

    axis.attr("transform", "translate(" + (spacing / 2) + ", " + (posY + 150) + ")")

  }
}

document.getElementById("graph-view-mode").addEventListener("change", function(e) {
  const source = e.target;
    
  const value = source.options[source.selectedIndex].value;
  graphViewMode = value;
  console.log(graphViewMode);
  if (!connectionGraphContainer.classList.contains("loading")) {
    if (graphViewMode == "spin") {
      svgToSpinView();
    } else {
      svgTimeView();
    }
  }
});

