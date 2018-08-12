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
            logMsg('init() : Settings Loaded: ' + sSettings.replace('"', ''));
        }
        configurePopup();
    });
}

function setExtensionState(enabled) {
    chrome.storage.sync.set({ enabled: enabled }, function() {
        settings.enabled = enabled;
        logMsg('setExtensionState(' + enabled + ') : Extension ' + (enabled ? 'Enabled.' : 'Disabled.'));
    });

    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: enabled ? 'green' : 'red'
    });

    if (enabled) injectScript();
}

btnToggle.onclick = function(element) {
    if (settings.enabled) {
        setExtensionState(false);
        $('#btnToggle').removeClass('on');
        $('#btnToggle').addClass('off');
        $('#btnToggle').html('OFF');
    } else {
        setExtensionState(true);
        $('#btnToggle').removeClass('off');
        $('#btnToggle').addClass('on');
        $('#btnToggle').html('ON');
    }
};

function configurePopup() {
    logMsg('configurePopup() : isEnabled=' + settings.enabled);
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
    logMsg('injectScript() : JobGrabber.js Content Script injected into 3Play Page.');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: 'JobGrabber.js'
        });
    });
}

function logMsg(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: 'console.log("' + settings.title + ' -> ' + fileName + ' :: ' + message + '");' });
    });
}
