dataManager.connections = [];


dataManager.doesConnectionExistByName = function (name) {
  const connections = this.connections;
  for (let i = 0; i < connections.length; i++) {
    if (connections[i].name === name) {
      return true;
    }
  }
};


dataManager.getConnectionByName = function (name) {

  const connections = this.connections;
  for (let i = 0; i < connections.length; i++) {
    if (connections[i].name === name) {
      return connections[i];
    }
  }
};


dataManager.createItemConnection = function (name, details) {
  if (!this.doesConnectionExistByName(name)) {
    const connections = this.connections;
    const newConnection = {
      children: [],
      id: this.generateNewId(),
      name: name,
      directions: {}
    };

    if (typeof(details) === "object") {
      newConnection.details = details;
    }
    connections[connections.length] = newConnection;
    return newConnection;
  }
};


dataManager.getItemConnections = function (item) {
  const connectionsList = [];
  const connections = this.connections;
  for (let i = 0; i < connections.length; i++) {
    if (connections[i].children.includes(item)) {
      connectionsList[connectionsList.length] = connections[i];
    }
  }
  return connectionsList;
};


dataManager.getConnectionItems = function (connection) {
  return connection.children;
};

dataManager.getConnectionItemsWithoutItem = function (connection, item) {
  const itemList = [];
  const oldList = connection.children;
  for (let i = 0; i < oldList.length; i++) {
    if (oldList[i] != item) {
      itemList[itemList.length] = oldList[i];
    }
  }
  return itemList;
};



dataManager.setConnectionGroup = function (connection, group) {
  connection.group = group;
  return true;
};

dataManager.getConnectionGroup = function (connection) {
  return connection.group;
};


(function() {
  const methodsList = dataManager.constructor.methodsList;
  methodsList[methodsList.length] = {
    key: "joinConnection",
    func: function (connection) {
      const children = connection.children;
      if (!children.includes(this)) {
        children[children.length] = this;
      }
      return true;
    }
  };
  methodsList[methodsList.length] = {
    key: "getConnections",
    func: function () {
      const connectionsList = [];
      const connections = dataManager.connections;
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].children.includes(this)) {
          connectionsList[connectionsList.length] = connections[i];
        }
      }
      return connectionsList;
    }
  };
})();