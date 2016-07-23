

// chrome.storage.sync.set({"search_terms": ban_list})


// TODO: This code clears the sync storage
// chrome.storage.sync.clear(function() {});

// var bannedSites = ["facebook", "mail.google"];
// var ban_list = [];
// var currentTab = {};
//
// chrome.tabs.onUpdated.addListener(function() {
//   chrome.windows.getAll({populate: true}, function(list) {
//     // console.log(list)
//     ban_list = [];
//     for (var i in list) {
//       var tabs = list[i].tabs;
//       for (var j in tabs) {
//         var tab = tabs[j]
//         // If there are any sites added to the ban list:
//         if (bannedSites) {
//           for (var site in bannedSites) {
//             if (tab.url.indexOf(bannedSites[site]) != -1){
//               ban_list.push({
//                 windowId  : list[i].id,
//                 tabId     : tab.id,
//                 url       : tab.url,
//                 index     : tab.index
//               });
//             }
//           }
//         } else {
//           ban_list.push({
//             windowId    : list[i].id,
//             tabId       : tab.id,
//             url         : tab.url,
//             index       : tab.index
//           });
//         }
//       }
//     }
//   })
//   console.log(ban_list)
// })


//
// chrome.tabs.onCreated.addListener(function(tabDetails) {
//   console.log(tabDetails);
//
//   console.log(currentTab);
//   console.log(ban_list);
//   if (ban_list.length >= 1) {
//     var targetId = ban_list[0].tabId;
//     var targetWindow = currentTab.windowId;
//     var targetIndex = currentTab.index;
//
//
//     chrome.tabs.move(targetId, {windowId : tabDetails.windowId, index : tabDetails.index}, function() {
//       chrome.tabs.remove(tabDetails.id);
//       chrome.tabs.update(ban_list[0].tabId, {selected: true})
//     })
//   }
// })

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  console.log("web navigation onBeforeNavigate");
  console.log(details)
});

chrome.tabs.onActivated.addListener(function(details) {
  console.log("tabs onActivated");
  console.log(details);
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var url = tab.url;
  if (url != undefined && changeInfo.status == "complete") {
    console.log("tabs onUpdated with conditions");
    console.log(tab);
  }
})








// Might be useful:
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (typeof tab.url != "undefined") {
//     console.log(JSON.stringify(tab.index));
//   }
// });
