let fileName = 'options.js';
let settings;

chrome.storage.sync.get(['title', 'enabled', 'debug', 'refreshRate'], function(results) {
    settings = results;
    init();
});

function init() {
    if (settings.debug) {
        sSettings = JSON.stringify(settings);
        // prettier-ignore
        sSettings = sSettings.replace(/["']/g, '');
        logMsg('init() : Settings Loaded: ' + sSettings.replace('"', ''));
    }

    let eleId = 'rdRef_' + settings.refreshRate;
    let ele = document.getElementById(eleId);
    ele.checked = true;

    // register radio click events
    document.getElementById('rdRef_5').addEventListener('click', function() {
        setRefreshRate(5);
    });
    document.getElementById('rdRef_10').addEventListener('click', function() {
        setRefreshRate(10);
    });
    document.getElementById('rdRef_15').addEventListener('click', function() {
        setRefreshRate(15);
    });
    document.getElementById('rdRef_30').addEventListener('click', function() {
        setRefreshRate(30);
    });
    document.getElementById('rdRef_60').addEventListener('click', function() {
        setRefreshRate(60);
    });
}

function setRefreshRate(rate) {
    settings.refreshRate = rate;
    chrome.storage.sync.set({ refreshRate: rate }, function() {});
    logMsg('setRefreshRate() : refreshRate is now ' + rate);
}

function logMsg(message) {
    console.log('%s -> %s :: %s', settings.title, fileName, message);
}
