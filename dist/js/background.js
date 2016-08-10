

// chrome.storage.sync.set({"bannedSites": []})


// TODO: This code clears the sync storage
// chrome.storage.sync.clear(function() {});
var bannedSites = [];

var versionNum = 1.11;

function initializeStorage() {
  chrome.storage.sync.get( null, function(obj) {
    if ( obj.bannedSites && obj.version && obj.version === versionNum ) {
      bannedSites = obj.bannedSites;
    } else {
      console.log("Initializing storage");
      chrome.storage.sync.clear(function() {
      });
      chrome.storage.sync.set( {
        "version"       : versionNum,
        "bannedSites"   : [
          {
            "url"       : "https://mail.google.com/mail/u/0/#inbox",
            "imgSrc"    : "images/gmail.png",
            "name"      : "Gmail",
            "class"     : "gmail",
            "block"     : true
          },
          {
            "url"       : "https://outlook.live.com/owa/",
            "imgSrc"    : "images/outlook.png",
            "name"      : "Hotmail",
            "class"     : "hotmail",
            "block"     : true
          },
          {
            "url"       : "https://www.amazon.com/",
            "imgSrc"    : "images/amazon.png",
            "name"      : "Amazon",
            "class"     : "amazon",
            "block"     : false
          },
          {
            "url"       : "https://twitter.com",
            "imgSrc"    : "images/twitter.png",
            "name"      : "Twitter",
            "class"     : "twitter",
            "block"     : false
          },
          {
            "url"       : "https://www.facebook.com/",
            "imgSrc"    : "images/fb.png",
            "name"      : "Facebook",
            "class"     : "facebook",
            "block"     : true
          },
          {
            "url"       : "https://www.pinterest.com/",
            "imgSrc"    : "images/pinterest.png",
            "name"      : "Pinterest",
            "class"     : "pinterest",
            "block"     : false
          },
          {
            "url"       : "https://www.reddit.com/",
            "imgSrc"    : "images/reddit.png",
            "name"      : "Reddit",
            "class"     : "reddit",
            "block"     : false
          },
          {
            "url"       : "https://www.youtube.com/",
            "imgSrc"    : "images/youtube-square.png",
            "name"      : "Youtube",
            "class"     : "youtube",
            "block"     : false
          }
        ]
      })

    }
  })
}


chrome.storage.onChanged.addListener( function listenToChanges( changes, areaName ) {
  if ( changes.bannedSites ) {
    bannedSites = changes.bannedSites.newValue;
    for (var site = 0; site < bannedSites.length; site++ ) {
      if ( bannedSites[site].block === true ) {
        var blockedUrl = bannedSites[site].url;

        chrome.windows.getAll( { populate: true }, function( list ) {
          // console.log(list);
          for ( var i in list ) {
            var tabs = list[i].tabs;
            for ( var j in tabs ) {
              var tab = tabs[j]
              // console.log(tab.url);
              if ( tab.url.indexOf( blockedUrl ) > -1) {
              }
            }
          }
        })
      }
    }
  }
  getUpdatedTabs();
  // console.log(changes.bannedSites);
})

// checkDuplicates(){
//
// }

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
}

function checkExcludeSites( tabId ) {
  if ( excludeSites.indexOf( tabId ) >= 0 ) {
    var removedTab = excludeSites.indexOf( tabId );
    excludeSites.splice( removedTab, 1 );
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
            if ( tab.url.indexOf( bannedSites[site].url ) !== -1 && excludeSites.indexOf( tab.id ) === -1 && bannedSites[site].block === true ){
              activeTabs.push({
                banUrl    : bannedSites[site].url,
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
    chrome.tabs.update( tabObj.tabToMove, { url : tabObj.tabUrl })
  }
  chrome.tabs.move(   tabObj.tabToMove, { windowId : tabObj.windowId, index : tabObj.index }, function() {} )
  chrome.tabs.remove( tabObj.tabId );
  chrome.tabs.update( tabObj.tabToMove, { selected : true } )
}


function logUpdated( tabId, changeInfo, tabInfo ) {
  if ( changeInfo.status === "loading" ) {
    // console.log( "Updated tab: " + tabId );
    // console.log( "Changed attributes: " );
    // console.log( changeInfo );
    // console.log( "New tab Info: " );
    // console.log( tabInfo );
  }

}

  var thisTab = {};

chrome.tabs.onUpdated.addListener( logUpdated );

chrome.tabs.onCreated.addListener( function( tab )  {
} )

chrome.tabs.onUpdated.addListener( function filterForTabulatr( tabId, changeInfo, tab ) {
  var url = tab.url;
  if ( url != undefined && changeInfo.status === "loading" ) {
    for ( var site = 0; site < activeTabs.length; site++ ) {
      var bannedSite = activeTabs[site]

      // Starting to add exceptions to be added to excludeSites
      if ( url.indexOf( "?view=cm" ) > 0 || url.indexOf( "compose" ) > 0 ) {
        excludeSites.push( tab.id );
        // console.log( excludeSites );
        return;
      }



      if ( url.indexOf( bannedSite.banUrl ) !== -1 && tabId !== bannedSite.tabId ) {
        if ( url.length > bannedSite.banUrl.length ) {
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
        // console.log( thisTab )
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
