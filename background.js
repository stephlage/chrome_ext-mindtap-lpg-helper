console.log("background running for lpg helper");
chrome.browserAction.onClicked.addListener(menubuttonClicked);

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

function menubuttonClicked(tab) {
  chrome.tabs.sendMessage(tab.id, { message: "start" });
}

chrome.runtime.onMessage.addListener(receiver);
let params = {
  active: true,
  currentWindow: true
};

function receiver(request, sender, sendResponse) {
  if (request.message === "scrapestart") {
    console.log("scrapestart");
    chrome.tabs.query(params, gotTabs);
    function gotTabs(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "scrapedone" });
    }
  } else if (request.message === "done") {
    console.log("done?");
  }
}
