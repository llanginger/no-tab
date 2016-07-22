

// chrome.storage.sync.set({"search_terms": ban_list})


// TODO: This code clears the sync storage
// chrome.storage.sync.clear(function() {});

var banTerm = "facebook";
var ban_list = [];
var currentTab = {};

chrome.tabs.onUpdated.addListener(function() {
  chrome.windows.getAll({populate: true}, function(list) {
    // console.log(list)
    ban_list = [];
    for (var i in list) {
      var tabs = list[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j]
        if (ban_list) {
          if (tab.url.indexOf(banTerm) != -1){
            ban_list.push({
              windowId  : list[i].id,
              tabId     : tab.id,
              url       : tab.url,
              index     : tab.index
            });
          }
        } else {
          ban_list.push({
            windowId    : list[i].id,
            tabId       : tab.id,
            url         : tab.url,
            index       : tab.index
          });
        }
      }
      // console.log(ban_list);
    }
  })
})



chrome.tabs.onCreated.addListener(function(tabDetails) {
  // console.log(tabDetails);
  currentTab = {
    tabId         : tabDetails.id,
    tabIndex      : tabDetails.index,
    tabUrl        : tabDetails.url,
    openerTabId   : tabDetails.openerTabId,
    windowId      : tabDetails.windowId,
  }

  console.log(currentTab);
  console.log(ban_list);
  if (ban_list.length === 1) {
    var tabId = ban_list[0].tabId;
    var targetWindow = currentTab.windowId;
    var targetIndex = currentTab.index;

    chrome.tabs.remove(currentTab.tabId)
    chrome.tabs.move(ban_list[0].tabId, {windowId : tabDetails.windowId, index : tabDetails.index}, function() {
      chrome.tabs.update(ban_list[0].tabId, {selected: true})
    })
  }
})

// chrome.tabs.move(tabId, {windowId : targetWindow, index : targetIndex})
// chrome.tabs.move(1417, {windowId: 415, index: 0})



// Might be useful:
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (typeof tab.url != "undefined") {
//     console.log(JSON.stringify(tab.index));
//   }
// });
