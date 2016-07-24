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


document.getElementById("ban-list").textContent = "Hello";


function createListItems(obj) {
  console.log(obj.bannedSites);
  var theList = document.getElementById("ban-list");
  console.log(theList);
  for (var site = 0; site < obj.bannedSites.length; site++) {
    var content = document.createElement("li");
    content.innerHTML = obj.bannedSites[site];
    theList.appendChild(content)
  }
}
