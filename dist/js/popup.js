var console = chrome.extension.getBackgroundPage().console;

chrome.storage.sync.get(null, function(obj) {
  if ( !obj.visited || obj.visited === false) {
    console.log("First time");
    $(".grey-filter, .modal-instructions").fadeIn('fast', function() {});
    $(".grey-filter, .close-info").click(function() {
      $(".grey-filter, .modal-instructions").fadeOut('fast', function() {
      });
    })
    var storageObj = obj;
    obj.visited = true;

    chrome.storage.sync.set( storageObj )
  }
  if (obj.bannedSites) {
    createToggles( obj.bannedSites )
    createListItems( obj );
  } else {
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
        '<li class="brand-toggle"><img class="toggle-img" src="' + site.imgSrc + '" alt="' + site.name + '" title="' + site.name + '"/>' +
          '<label class="switch">' +
            '<input class="' + site.class + ' toggle-switch" type="checkbox" value="' + site.name + '">' +
            '<div class="slider round"></div>' +
          '</label>' +
        '</li>'
      )
      if( bSites[i].block === true ) {
        $("." + site.class).prop( "checked", true );
      } else {
        $("." + site.class).prop( "checked", false );
      };
      $("." + site.class).click(function() {
        checkBoxToggle($(this).attr("value"));
      })
      // console.log(bSites[i])
      // console.log( bSites[i].name )
    }
  }
}




function createListItems( obj ) {
  if (obj.bannedSites.length > 0){
    for (var site = 0; site < obj.bannedSites.length; site++) {
      if (obj.bannedSites[site].hasOwnProperty("name") === false ){
        $("#ban-list").append("<div class='list-box'><li>" + obj.bannedSites[site].url + "</li></div>")
      }
    }
  } else {
    console.log("empty list");
  }
}


$("#submit").submit(function() {
  if ( $("#add-new").val().length > 0 ){
    // e.preventDefault();
    var content = {
      "url"       : $("#add-new").val(),
      "block"     : true
    }

    chrome.storage.sync.get("bannedSites", function(obj) {
      obj.bannedSites.push(content);

      chrome.storage.sync.set(obj);
      createListItems();
    })
  }
})

$("#remove-last").click(function() {
  chrome.storage.sync.get("bannedSites", function(obj) {
    if ( obj.bannedSites[obj.bannedSites.length-1].hasOwnProperty("name") === false ){
      obj.bannedSites.pop();
      chrome.storage.sync.set(obj)

    }
  })
  document.location.reload(true);
})

$(".info").click(function() {
  $(".grey-filter, .modal-instructions").fadeIn('fast', function() {});
  $(".grey-filter, .close-info").click(function() {
    $(".grey-filter, .modal-instructions").fadeOut('fast', function() {
    });
  })
})
