let changeTab;
(function () {
  const tabPanels = document.getElementsByClassName("tab-panel");
  const changeTabUserInput = function (e) {
    const source = e.target;
    const value = Number(source.value);
    
    if (!isNaN(value)) {
      
      const id = this.id;
      if (id != undefined) {
        console.log(value);
        const tabContainer = document.querySelector("[tab-panel=" + id + "]");
        if (tabContainer != undefined) {
          const tabs = tabContainer.getElementsByClassName("tab");
          const tab = tabs[value];
          if (tab != undefined) {
            for (let i = 0; i < tabs.length; i++) {
              tabs[i].classList.add("hidden");
            }
            tab.classList.remove("hidden");
          }
        }
      }
    }
  };

  changeTab = function (id, value) {
    const tabController = document.getElementById(id);
    console.log(id, tabController)
    if (tabController != undefined) {
      tabController.getElementsByTagName("input")[value].checked = true;

      const tabContainer = document.querySelector("[tab-panel=" + id + "]");
      if (tabContainer != undefined) {
        const tabs = tabContainer.getElementsByClassName("tab");
        const tab = tabs[value];
        if (tab != undefined) {
          for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.add("hidden");
          }
          tab.classList.remove("hidden");
        }
      }
    }
  };

  for (let i=0; i < tabPanels.length; i++) {
   
    tabPanels[i].addEventListener("change", changeTabUserInput, false);
  }
})();

