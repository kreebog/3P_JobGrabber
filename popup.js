let fileName = 'popup.js';

configurePopup();

function getTitle() {
    chrome.storage.sync.get(['title'], function(result) {
        title = result;
    });
}

function getEnabled() {
    chrome.storage.sync.get(['enabled'], function(result) {
        enabled = result;
    });
}

function setExtensionState(title, enabled) {
    chrome.storage.sync.set({ enabled: enabled }, function() {
        logMsg(title + ' : setExtensionState() : Extension ' + (enabled ? 'Enabled.' : 'Disabled.'));
    });
}

btnToggle.onclick = function(element) {
    chrome.storage.sync.get(['title', 'enabled'], function(results) {
        if (results.enabled) {
            setExtensionState(results.title, false);
            $('#btnToggle').removeClass('on');
            $('#btnToggle').addClass('off');
            $('#btnToggle').html('OFF');
        } else {
            setExtensionState(results.title, true);
            $('#btnToggle').removeClass('off');
            $('#btnToggle').addClass('on');
            $('#btnToggle').html('ON');
        }
    });
};

function configurePopup() {
    chrome.storage.sync.get(['title', 'enabled'], function(results) {
        logMsg(results.title + ' : configurePopup() : isEnabled=' + results.enabled);
        if (results.enabled) {
            $('#btnToggle').removeClass('off');
            $('#btnToggle').addClass('on');
            $('#btnToggle').html('ON');
        } else {
            $('#btnToggle').removeClass('on');
            $('#btnToggle').addClass('off');
            $('#btnToggle').html('OFF');
        }
    });
}

function logMsg(message) {
    let queryInfo = { active: true, currentWindow: true };
    chrome.tabs.query(queryInfo, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: 'console.log("' + fileName + ' :: ' + message + '");' });
    });
}
