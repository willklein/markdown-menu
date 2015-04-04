'use strict';

var previousTimestamp;

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (previousTimestamp && details.timeStamp - previousTimestamp < 1000) {
    chrome.tabs.executeScript(details.tabId, {
      file: 'scripts/contentscript.js'
    });
  }

  previousTimestamp = details.timeStamp;
});
