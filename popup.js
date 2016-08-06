var console = chrome.extension.getBackgroundPage().console;


chrome.storage.sync.get("bannedSites", function(obj) {
  if (obj.bannedSites) {


    // if (obj.bannedSites.indexOf( "https://www.facebook.com/" ) > -1 ) {
    //   console.log("prop found")
    //   $(".facebook").prop("checked", true);
    // }
    console.log("Found storage");
    createToggles( obj.bannedSites )
    createListItems( obj );
  } else {
    console.log( "No storage found" );
  }
})

function checkBoxToggle( checkName ) {
  chrome.storage.sync.get("bannedSites", function(obj) {
    var site = findObjByName( checkName, obj.bannedSites )
    if ( obj.bannedSites[site].block === false ) {
      obj.bannedSites[site].block = true;
    } else {
      obj.bannedSites[site].block = false;
    }
    chrome.storage.sync.set(obj)
    console.log(obj)
  })
}

function findObjByName( name, arr ) {
  for ( var i = 0; i < arr.length; i++ ){
    if ( arr[i].name === name ){
      return i;
    }
  }
}

function createToggles( bSites ) {
  for (var i = 0; i < bSites.length; i++) {
    if ( bSites[i].name ) {
      var site = bSites[i];
      $("#toggle-list").append(
        '<li class="brand-toggle"><img src="' + site.imgSrc + '" />' +
          '<label class="switch">' +
            '<input class="' + site.class + ' toggle-switch" type="checkbox" value="' + site.name + '">' +
            '<div class="slider"></div>' +
          '</label>' +
        '</li>'
      )
      if( bSites[i].block === true ) {
        $("." + site.class).prop( "checked", true );
      } else {
        $("." + site.class).prop( "checked", false );
      }
      console.log(bSites[i])
      console.log( bSites[i].name )
    }
  }
}

$(document).on("click", ".toggle-switch", function() {
  console.log($(this).attr("value"));
  checkBoxToggle($(this).attr("value"));
})
// $(".testing").click(function() {
//   checkBoxToggle("Facebook")
// })




function createListItems( obj ) {
  var theList = document.getElementById("ban-list");


  if (obj.bannedSites.length > 0){
    for (var site = 0; site < obj.bannedSites.length; site++) {
      var content = document.createElement("li");
      content.innerHTML = obj.bannedSites[site].url;
      theList.appendChild(content)
    }
  } else {
    console.log("empty list");
  }
}


$("#submit").submit(function() {
  // e.preventDefault();
  var content = {
    url: $("#add-new").val()
  }

  chrome.storage.sync.get("bannedSites", function(obj) {
    obj.bannedSites.push(content);

    chrome.storage.sync.set(obj);
    createListItems();
    console.log(obj);
  })
  console.log(content);
})

$("#remove-last").click(function() {
  chrome.storage.sync.get("bannedSites", function(obj) {
    obj.bannedSites.pop();
    chrome.storage.sync.set(obj)
    console.log(obj);
    createListItems();
  })
})

$("#reset").click(function() {
  chrome.storage.sync.get("bannedSites", function(obj) {
    obj.bannedSites = [];
    chrome.storage.sync.set(obj)
    console.log(obj);

    $("ban-list").empty();
  })
})
