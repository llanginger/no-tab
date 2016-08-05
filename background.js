

// chrome.storage.sync.set({"bannedSites": []})


// TODO: This code clears the sync storage
// chrome.storage.sync.clear(function() {});
var bannedSites = [];
function initializeStorage() {
  chrome.storage.sync.get( "bannedSites", function(obj) {
    if (obj.bannedSites) {
      bannedSites = obj.bannedSites;
      console.log("current bannedSites storage: " + bannedSites)
    } else {
      console.log("Initializing storage");
      chrome.storage.sync.set( { "bannedSites": ["https://www.facebook.com/", "https://mail.google.com/mail/u/0/#inbox"] } )
    }
  })
}

chrome.storage.onChanged.addListener( function listenToChanges( changes, areaName ) {
  bannedSites = changes.bannedSites.newValue;
  console.log( "current bannedSites storage now: " + bannedSites );
  getUpdatedTabs();
  // console.log(changes.bannedSites);
})

var activeTabs     = [];
var excludeSites   = [];
var currentTab     = {};
var currentId;

function onRequest(request, sender, sendResponse) {
  alert(request);
  sendResponse( "Click registered" );
}

chrome.extension.onMessage.addListener( onRequest );


chrome.tabs.onCreated.addListener( getUpdatedTabs );
chrome.tabs.onRemoved.addListener( getUpdatedTabs );
chrome.tabs.onRemoved.addListener( checkExcludeSites );
chrome.webNavigation.onDOMContentLoaded.addListener( getUpdatedTabs );

chrome.tabs.onActivated.addListener( setCurrentId )

function setCurrentId ( tab ) {
  currentId = tab.tabId;
  console.log( currentId );
}

function checkExcludeSites( tabId ) {
  if ( excludeSites.indexOf( tabId ) >= 0 ) {
    var removedTab = excludeSites.indexOf( tabId );
    excludeSites.splice( removedTab, 1 );
    console.log( excludeSites );
  }
}

function getUpdatedTabs() {

  // console.log( "updated tabs called" );
  chrome.windows.getAll( { populate: true }, function( list ) {
    activeTabs = [];
    // console.log("This should be empty: " + activeTabs)
    // console.log(list)
    for ( var i in list ) {
      var tabs = list[i].tabs;
      for ( var j in tabs ) {
        var tab = tabs[j]
        // If there are any sites added to the ban list:
        if ( bannedSites ) {
          for ( var site in bannedSites ) {
            if ( tab.url.indexOf( bannedSites[site] ) !== -1 && excludeSites.indexOf( tab.id ) === -1 ){
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
    // console.log( "Active tabs now: " )
    // console.log( activeTabs )
  })

}


function tabulatr( tabObj ) {
  if (tabObj.tabUrl) {
    console.log("redirect url found")
    chrome.tabs.update( tabObj.tabToMove, { url : tabObj.tabUrl })
  }
  chrome.tabs.move(   tabObj.tabToMove, { windowId : tabObj.windowId, index : tabObj.index }, function() {} )
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

chrome.tabs.onCreated.addListener( function( tab )  {
  console.log( "testing, tab info: ");
  console.log( tab );
} )

chrome.tabs.onUpdated.addListener( function filterForTabulatr( tabId, changeInfo, tab ) {
  var url = tab.url;
  if ( url != undefined && changeInfo.status === "loading" ) {
    for ( var site = 0; site < activeTabs.length; site++ ) {
      console.log( "main function fired" );
      var bannedSite = activeTabs[site]
      console.log( activeTabs[site] )

      // Starting to add exceptions to be added to excludeSites
      if ( url.indexOf( "?view=cm" ) > 0 || url.indexOf( "compose" ) > 0 ) {
        excludeSites.push( tab.id );
        console.log( excludeSites );
        return;
      }



      if ( url.indexOf( bannedSite.banUrl ) !== -1 && tabId !== bannedSite.tabId ) {
        if ( url.length > bannedSite.banUrl.length ) {
          console.log("longer link clicked")
          thisTab = {
            tabToMove   : bannedSite.tabId,
            windowId    : tab.windowId,
            index       : tab.index,
            tabId       : tab.id,
            tabUrl      : tab.url
          }
        } else {
          thisTab = {
            tabToMove   : bannedSite.tabId,
            windowId    : tab.windowId,
            index       : tab.index,
            tabId       : tab.id
          }
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
  initializeStorage()
  getUpdatedTabs();
  console.log( "init called" );
}

init();


// TODO: Add NEW check against new tabs - make this check non-fuzzy and check against a full url. This might necessitate regexing to allow the first instance of the banned tab to still be fuzzy (to remove the www. and .com/*) Also, consider adding toggle buttons for "common" services like gmail, yahoo, other sites people might want to use
