// function importHierarchy (item, newItem, items, itemsList) {
//   const parentId = item.parent;
//   for (let i = 0; i < itemsList.length) {
//     if (items[i].id === parentId) {
//       const newParent = new dataManager.constructor.build(newItem);
//       if (newParent.parent !== undefined) {
//         return
//       } else {

//       }
//     }
//   }
// }



const dataManager = {
	lastId: 1,
	constructor: {
		build: function (parent) {
			this.parent = parent;
			this.children = [];
			this.data = {};
			this.elements = [];
			const methodsList = dataManager.constructor.methodsList;
			for (let i = 0; i < methodsList.length; i++) {
				const method = methodsList[i];
				this[method.key] = method.func;
			}
		},
		methodsList: [
			{
				func: function (key, data) {
					this.data[key] = data;
				},
				key: "setData"
			},
			{
				func: function (key, fallback) {
					if (fallback != undefined) {
						return this.data[key] !== undefined ? this.data[key] : fallback;
					}
					return this.data[key];
				},
				key: "getData"
			},
			{
				func: function () {
					return dataManager.removeItem(this);
				},
				key: "remove"
			}
		]
	},
	items: {
		list: [],
		hierarchy: {
			root: true,
			children: [],
			id: 0
		}
	},

/////////////////////////////////////////////////////////////////////////////////////////////
////// hierarchy FUNCTIONS //////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

	/*
	  Add item
	*/
	generateNewId: function () {
		dataManager.lastId++;
		return dataManager.lastId;
	},
	addItem: function (parent, index) {
		index = Number(index);
		if (parent == undefined) {
			parent = this.items.hierarchy;
		}


		const itemsList = this.items.list;
		const item = new dataManager.constructor.build(parent);

		item.id = this.generateNewId();
		itemsList[itemsList.length] = item;

		if (isNaN(index)) {
			parent.children[parent.children.length] = item;
		} else {
			parent.children.splice(index, 0, item);
		}

		return item;
	},

	/*
	  Remove all children
	*/
	removeChildren: function (item) {
		const children = item.children;
		if (children !== undefined && typeof (children) === "object") {
			for (let i = children.length - 1; i > -1; i--) {
				dataManager.removeItem(children[i]);
			}
		}
	},

	/*
		Get the children of the item (sub items)
	*/
	getChildren: function (parent) {
		if (parent != undefined && index != undefined && !isNaN(index)) {
			return parent.children;
		}
	},

	getSiblings: function (item, withSelf) {
		const parent = item.parent;
		if (parent != undefined) {
			const children = parent.children; 
			if (children != undefined) {
				if (!withSelf) {
					const siblings = [];
					for (let i = 0; i < children.length; i++) {
						const sibling = children[i];
						if (item.id !== sibling.id) {
							siblings[siblings.length] = sibling;
						}
					}
					return siblings;
				} else {
					return children;
				}
			}
		}
	},

	/*
		swap
	*/
	swapBy: function (item1, item2) {
		const index1 = this.getIndex(item1);
		const index2 = this.getIndex(item2);


		const parent1 = item1.parent;
		const children1 = parent1.children;

		const parent2 = item2.parent;
		const children2 = parent2.children;

		children1.splice(index1, 1, item2);
		children2.splice(index2, 1, item1);

		item1.parent = parent2;
		item2.parent = parent1;

		return true;
	},

	/* 
		Move to root
	*/
	moveToRoot: function (item) {
		const parent = item.parent;
		const id = item.id;
		const children = parent.children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].id === id)  {
				children.splice(i, 1);
				break;
			}
		}

		const hierarchy = this.items.hierarchy;
		item.parent = hierarchy;
		
		const hierarchyChildren = hierarchy.children;
		hierarchyChildren[hierarchyChildren.length] = item;

		return item;
	},
	

	/*
		Remove item
	*/
	removeItem: function (item) {
		let parent = item.parent;
		if (parent != undefined) {

			// remove from the whole list
			const itemsList = this.items.list;
			for (let i = 0; i < itemsList.length; i++) {
				const item_ = itemsList[i];
				if (item_.id === item.id) {
					itemsList.splice(i, 1);
					break;
				}
			}

			// remove from the parent
			for (let i = 0; i < parent.children.length; i++) {

				const item_ = parent.children[i];
				if (item_.id === item.id) {

					parent.children.splice(i, 1);
					break;
				}
			}

			dataManager.removeChildren(item);

			return true;
		}
	},

	mirror: function (item, parent) {

		const mirror = dataManager.addItem();

		let mirrorId = item.mirrorId;
		if (mirrorId === undefined) {
			mirrorId = this.generateNewId();
			item.mirrorId = newId;
		}

		mirror.mirrorId = mirrorId;
		mirror.data = item.data;

		return mirror;
	},

	unMirror: function (item) {
		item.mirrorId = undefined;
		item.data = deepCopy(item.data);
	},

	/*
		Remove item by Index 
	*/
	removeItemByIndex: function (index, parent) {
		let children;
		if (parent == undefined) {
			parent = this.items.hierarchy;
			children = parent.children;
		}
		if (index != undefined && !isNaN(index) && typeof (children) === "object") {
			const item = children[index];
			if (item != undefined) {
				const id = item.id;
				// remove from the whole list
				const itemsList = this.items.list;
				for (let i = 0; i < itemsList.length; i++) {
					if (itemsList[i].id === id) {
						itemsList.splice(i, 1);
						break;
					}
				}
				// remove from the parent
				children.splice(index, 1);

				dataManager.removeChildren(item);
				
				return true;
			}
		}
	},

	/*
		Get index
	*/
	getIndex: function (item) {
		const parent = item.parent;
		const id = item.id
		const parentChildren = parent.children;
		for (let i = 0; i < parentChildren.length; i++) {
			if (parentChildren[i].id === id) {
				return i;
			}
		}
	},


	/*
	  Remove item by ID
	*/
	removeItemById: function (item, id) {
		const parent = item.parent;
		if (parent != undefined && id != undefined && !isNaN(id)) {

			// remove from the whole list
			const itemsList = this.items.list;
			for (let i = 0; i < itemsList.length; i++) {
				const item = itemsList[i];
				if (item.id === id) {
					itemsList.splice(i, 1);
					break;
				}
			}

			// remove from the parent
			for (let i = 0; i < parent.children.length; i++) {
				const item = parent[i];
				if (item.id === id) {
					parent.children.splice(i, 1);
					break;
				}
			}

			dataManager.removeChildren(item);


			return true;
		}
		return false;
	}

};