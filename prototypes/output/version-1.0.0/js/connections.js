/* 
  Inspiration from: https://www.d3-graph-gallery.com/graph/network_basic.html
*/
const margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 1336 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

const connectionGraphContainer = document.getElementById("connections-graph-container");
const svgRoot = d3.select(connectionGraphContainer)
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "loading")
  .attr("xmlns", "http://www.w3.org/2000/svg");

svgRoot.append("defs")
  .append("marker")
    .attr("id", "svgheadarrow")
    .call(function (D3_element) {

      element = D3_element.node();
      element.setAttributeNS("http://www.w3.org/2000/svg", "viewBox","0 0 10 10");
      element.setAttributeNS("http://www.w3.org/2000/svg", "refX","1");
      element.setAttributeNS("http://www.w3.org/2000/svg", "refY","5");
      element.setAttributeNS("http://www.w3.org/2000/svg", "markerUnits","strokeWidth");
      element.setAttributeNS("http://www.w3.org/2000/svg", "markerWidth","4");
      element.setAttributeNS("http://www.w3.org/2000/svg", "markerHeight","3");
      element.setAttributeNS("http://www.w3.org/2000/svg", "orient", "auto");
    }).append("path")
      .attr("d", "M 5,1 L 9,5 5,9 1,5 z")
      .attr("fill", "#6a9100")
;


const svg = svgRoot
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        svg.call(function(D3_element) {
          console.log(D3_element);
          D3_element.node().setAttributeNS("http://www.w3.org/2000/svg", "marker-end","url(#svgheadarrow)");
        })

      
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
      console.log(item);
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

  const relations = connectionInfo.getData("connections-with")[0].relations;
  if (typeof(relations) == "object") {
    console.log(relations);
    for (let i = 0; i < relations.length; i++) {
      const relation = relations[i];
      const item1 = connectionIdToItem[relation.a];
      const item2 = connectionIdToItem[relation.b];
      if (item1 != undefined && item2 != undefined) {
        links[links.length] = {
          name: relation.name,
          description: relation.description,
          source: item1.id,
          target: item2.id
        };
      }
    }
  }

  // Initialize the links
  const link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "bounding-box-line")
  ;
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
    .append("circle")
      .attr("class", "event-nodes")
      .attr("r", 20)
      .style("fill", "#292F32")
  ;

  const labelType = svg
  .selectAll(".svg-type-label")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("class", "svg-type-label")
    .text("Gebeurtenis")
  ;

  const labelName = svg
    .selectAll(".svg-name-label")
      .data(data.nodes)
      .enter()
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



  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    svgRoot.node().classList.remove("loading");
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .on("click", function (d, i) {
          // use d
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
                connectionDetails.getElementsByClassName("connection-details__description")[0].textContent = d.description;
              }
              const toInfoContainer = connectionDetails.getElementsByClassName("connection-details__to-info-container")[0];
              if (toInfoContainer != undefined) {
                toInfoContainer.classList.add("hidden");
              }

              connectionDetails.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            }
          } else {
            connectionDetails.classList.add("hidden");
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
      copyOfdomLink.classList.remove("bounding-box-line")
    }

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
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .on("click", function (d) {
          // scrollToTimelineElementByItem(d.item) 
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
                console.log(parentName);
                if (parentName == "events") {
                  toInfoContainer.classList.remove("hidden");
                  const button = toInfoContainer.getElementsByClassName("connection-details__to-info")[0];
                  if (button != undefined) {
                    button.textContent = "Ga naar gebeurtenis";
                    const previousItem = dataManager.getItemFromElement(button);
                    if (previousItem) {
                      dataManager.detachElement(button, previousItem);
                    }
                    console.log(dataManager.getItemFromElement(button));
                    dataManager.attachElement(button, item);
                  }
                } else {
                  toInfoContainer.classList.add("hidden");
                }
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
  }
}

