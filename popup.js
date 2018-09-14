let fileName = 'popup.js';
let settings;

init();

function init() {
    chrome.storage.sync.get(['title', 'enabled', 'debug', 'refreshRate'], function(results) {
        settings = results;
        if (settings.debug) {
            sSettings = JSON.stringify(settings);
            // prettier-ignore
            sSettings = sSettings.replace(/["']/g, '');
            logPageMsg('init() : Settings Loaded: ' + sSettings.replace('"', ''));
        }
        configurePopup();
    });
}

function setExtensionState(enabled) {
    chrome.storage.sync.set({ enabled: enabled }, function() {
        settings.enabled = enabled;
        logPageMsg('setExtensionState(' + enabled + ') : Extension ' + (enabled ? 'Enabled.' : 'Disabled.'));
    });

    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: enabled ? 'green' : 'red'
    });
}

btnDumpJobs.onclick = function(element) {
    execCmd('dumpJobs();');
};

btnClearJobs.onclick = function(element) {
    if (confirm('Are you sure you want to clear the snatched jobs list?')) {
        execCmd('jobs = [];');
    }
};

btnToggle.onclick = function(element) {
    if (settings.enabled) {
        execCmd('stopGrabber();');
        setExtensionState(false);
        $('#btnToggle').removeClass('on');
        $('#btnToggle').addClass('off');
        $('#btnToggle').html('OFF');
    } else {
        setExtensionState(true);
        $('#btnToggle').removeClass('off');
        $('#btnToggle').addClass('on');
        $('#btnToggle').html('ON');

        chrome.storage.sync.get('refreshRate', function(result) {
            let rate = result.refreshRate * 1000;
            logPageMsg('Starting jobGrabber with Refresh Rate of ' + rate + '.');
            execCmd('refreshRate = ' + rate + ';');
            execCmd('startGrabber();');
        });
    }
};

function configurePopup() {
    logPageMsg('configurePopup() : isEnabled=' + settings.enabled);
    if (settings.enabled) {
        $('#btnToggle').removeClass('off');
        $('#btnToggle').addClass('on');
        $('#btnToggle').html('ON');
    } else {
        $('#btnToggle').removeClass('on');
        $('#btnToggle').addClass('off');
        $('#btnToggle').html('OFF');
    }
}

function injectScript() {
    logPageMsg('injectScript() : JobGrabber.js Content Script injected into 3Play Page.');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: 'JobGrabber.js'
        });

        execCmd('startGrabber();');
    });
}

function execCmd(jsCmd) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: jsCmd });
    });
}

function logPageMsg(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: 'console.log("' + settings.title + ' -> ' + fileName + ' :: ' + message + '");' });
    });
}
