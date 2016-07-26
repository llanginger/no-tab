

// chrome.storage.sync.set({"bannedSites": []})


// TODO: This code clears the sync storage
// chrome.storage.sync.clear(function() {});
var bannedSites = [];
chrome.storage.sync.get("bannedSites", function(obj) {
  if (obj.bannedSites) {
    bannedSites = obj.bannedSites;
    console.log("current bannedSites storage: " + bannedSites)
  } else {
    console.log("Initializing storage");
    chrome.storage.sync.set({"bannedSites": []})
  }
})

chrome.storage.onChanged.addListener(function listenToChanges(changes, areaName) {
  bannedSites = changes.bannedSites.newValue;
  console.log("current bannedSites storage now: " + bannedSites);
  getUpdatedTabs();
  // console.log(changes.bannedSites);
})

// var bannedSites    = [".facebook", "mail.google"];

var activeTabs     = [];
var excludeSites   = [];
var currentTab     = {};
var currentId;

function onRequest(request, sender, sendResponse) {
  alert(request);
  sendResponse("Click registered");
}

chrome.extension.onMessage.addListener(onRequest);


chrome.tabs.onCreated.addListener( getUpdatedTabs );
chrome.tabs.onRemoved.addListener( getUpdatedTabs );
chrome.webNavigation.onDOMContentLoaded.addListener( getUpdatedTabs );

chrome.tabs.onActivated.addListener( setCurrentId )

function setCurrentId ( tab ) {
  currentId = tab.tabId;
  console.log( currentId );
}

function getUpdatedTabs() {

  console.log("updated tabs called");
  chrome.windows.getAll( { populate: true }, function( list ) {
    activeTabs = [];
    console.log("This should be empty: " + activeTabs)
    // console.log(list)
    for ( var i in list ) {
      var tabs = list[i].tabs;
      for ( var j in tabs ) {
        var tab = tabs[j]
        // If there are any sites added to the ban list:
        if ( bannedSites) {
          for ( var site in bannedSites ) {
            if ( tab.url.indexOf( bannedSites[site] ) !== -1 ){
              activeTabs.push({
                banUrl    : bannedSites[site],
                windowId  : list[i].id,
                tabId     : tab.id,
                url       : tab.url,
                index     : tab.index
              });
            }
          }
        }
      }
    }
    console.log("Active tabs now: ")
    console.log( activeTabs )
  })

}


function tabulatr( tabObj ) {
  chrome.tabs.move( tabObj.tabToMove, { windowId : tabObj.windowId, index : tabObj.index }, function() {} )
  chrome.tabs.remove( tabObj.tabId );
  chrome.tabs.update( tabObj.tabToMove, { selected : true } )
}


function logUpdated( tabId, changeInfo, tabInfo ) {
  if ( changeInfo.status === "loading" ) {
    console.log( "Updated tab: " + tabId );
    console.log( "Changed attributes: " );
    console.log( changeInfo );
    console.log( "New tab Info: " );
    console.log( tabInfo );
  }

}

  var thisTab = {};

chrome.tabs.onUpdated.addListener( logUpdated );

chrome.tabs.onUpdated.addListener( function filterForTabulatr( tabId, changeInfo, tab ) {
  var url = tab.url;
  if ( url != undefined && changeInfo.status === "loading" ) {
    for ( var site = 0; site < activeTabs.length; site++ ) {
      console.log( "main function fired" );
      var bannedSite = activeTabs[site]
      console.log( activeTabs[site] )

      if ( url.indexOf( bannedSite.banUrl ) !== -1 && tabId !== bannedSite.tabId ) {
        thisTab = {
          tabToMove   : bannedSite.tabId,
          windowId    : tab.windowId,
          index       : tab.index,
          tabId       : tab.id
        }
        tabulatr( thisTab );
        console.log( thisTab )
        // console.log(bannedSite)
        // console.log(bannedSite + " Exists")
        return;
        // console.log("This tab info: " + JSON.stringify(thisTab));
      }
    }
  }

})

function init() {
  getUpdatedTabs();
  console.log("init called");
}

init();

// TODO:
// Set up a content script to do the following: Detect if a link was clicked on and if so, disable Tabulatr functionality AND add the resulting page to a special exclusion list.
