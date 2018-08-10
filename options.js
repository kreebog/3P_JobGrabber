let fileName = 'options.js';
let title = '';
let enabled = false;

chrome.storage.sync.get(['title', 'enabled'], function(results) {
    title = results.title;
    enabled = results.enabled;
    start();
});

function start() {
    logMsg(title, 'start() : Enabled=' + enabled);
}

function logMsg(title, message) {
    console.log('%s -> %s :: %s', title, fileName, message);
}
