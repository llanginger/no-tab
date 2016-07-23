

// chrome.storage.sync.set({"search_terms": activeTabs})


// TODO: This code clears the sync storage
// chrome.storage.sync.clear(function() {});

var bannedSites = ["facebook", "mail.google"];
var activeTabs = [];
var currentTab = {};

chrome.tabs.onUpdated.addListener(function() {
  chrome.windows.getAll({populate: true}, function(list) {
    // console.log(list)
    activeTabs = [];
    for (var i in list) {
      var tabs = list[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j]
        // If there are any sites added to the ban list:
        if (bannedSites) {
          for (var site in bannedSites) {
            if (tab.url.indexOf(bannedSites[site]) != -1){
              activeTabs.push({
                banUrl    : bannedSites[site],
                windowId  : list[i].id,
                tabId     : tab.id,
                url       : tab.url,
                index     : tab.index
              });
            }
          }
        } else {
          activeTabs.push({
            windowId    : list[i].id,
            tabId       : tab.id,
            url         : tab.url,
            index       : tab.index
          });
        }
      }
    }
  })
  console.log(activeTabs)
})



// chrome.tabs.onCreated.addListener(function(tabDetails) {
//   console.log(tabDetails);
//   console.log(activeTabs);
//
//   if (activeTabs.length > 0) {
//     var targetId = activeTabs[0].tabId;
//     var targetWindow = tabDetails.windowId;
//     var targetIndex = tabDetails.index;
//
//
//     chrome.tabs.move(targetId, {windowId : tabDetails.windowId, index : tabDetails.index}, function() {
//       chrome.tabs.remove(tabDetails.id);
//       chrome.tabs.update(activeTabs[0].tabId, {selected: true})
//     })
//   }
// })

function shuffleTabs(tabObj) {
  chrome.tabs.move(tabObj.tabToMove, { windowId : tabObj.windowId, index : tabObj.index }, function() {
    // chrome.tabs.remove(tabObj.tabId);
    // chrome.tabs.update(tabObj.tabToMove, { selected : true })
  })
}

// function moveTabs() {
//
// }


// Listeners that don't work for what I want, at least not now
// chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
//   console.log("web navigation onBeforeNavigate");
//   console.log(details)
// });
//
// chrome.tabs.onActivated.addListener(function(details) {
//   console.log("tabs onActivated");
//   console.log(details);
// })
//

function logUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.status === "loading") {
    console.log("Updated tab: " + tabId);
    console.log("Changed attributes: ");
    console.log(changeInfo);
    console.log("New tab Info: ");
    console.log(tabInfo);
  }

}

  var thisTab = {};

chrome.tabs.onUpdated.addListener(logUpdated);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var url = tab.url;
  if (url != undefined && changeInfo.status == "loading") {
    for (var site = 0; site < activeTabs.length; site++) {
      var bannedSite = activeTabs[site]
      console.log(activeTabs[site])
      if (url.indexOf(bannedSite.banUrl) != -1) {
        thisTab = {
          tabToMove   : bannedSite.tabId,
          windowId    : tab.windowId,
          index       : tab.index,
          tabId       : tab.id
        }
        shuffleTabs(thisTab);
        console.log(thisTab)
        console.log(bannedSite)
        console.log(bannedSite + " Exists")
        return;
        // console.log("This tab info: " + JSON.stringify(thisTab));
      }
    }
  }
})








// Might be useful:
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (typeof tab.url != "undefined") {
//     console.log(JSON.stringify(tab.index));
//   }
// });
