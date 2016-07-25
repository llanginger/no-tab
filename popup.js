var console = chrome.extension.getBackgroundPage().console;

chrome.storage.sync.get("bannedSites", function(obj) {
  if (obj.bannedSites) {
    // alert("found storage");
    console.log("Found storage");
    createListItems(obj);
  } else {
    console.log("No storage found");
  }
})


function createListItems(obj) {
  var theList = document.getElementById("ban-list");

  if (obj.bannedSites.length > 0){
    for (var site = 0; site < obj.bannedSites.length; site++) {
      var content = document.createElement("li");
      content.innerHTML = obj.bannedSites[site];
      theList.appendChild(content)
    }
  } else {
    console.log("empty list");
  }
}


$("#submit").submit(function() {
  // e.preventDefault();
  var content = $("#add-new").val();
  chrome.storage.sync.get("bannedSites", function(obj) {
    obj.bannedSites.push(content);

    chrome.storage.sync.set(obj);
    createListItems();
    console.log(obj);
  })
  console.log(content);
})

$("#reset").click(function() {
  chrome.storage.sync.get("bannedSites", function(obj) {
    obj.bannedSites = [];
    chrome.storage.sync.set(obj)
    console.log(obj);

    $("ban-list").empty();
  })
})
