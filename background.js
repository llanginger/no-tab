var ban_list = ["facebook"];

// chrome.storage.sync.set({"search_terms": ban_list})


// TODO: This code clears the sync storage
chrome.storage.sync.clear(function() {});

chrome.windows.getAll({populate: true}, function(list) {
  console.log(list)
  for (var i in list) {
    var windows = [];
    var tabs = list[i].tabs;
    for (var j in tabs) {
      var tab = tabs[j].url
      var index = tabs[j].index
      if (tab.indexOf(ban_list) != -1){
        windows.push({
          "tab": tab,
          "index": index
        });
      }
    }
    console.log(windows);
  }
})

// Might be useful:
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (typeof tab.url != "undefined") {
    console.log(JSON.stringify(tab.index));
  }
});
