// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

console.log('3Play_JobGrabber Extension Activated');

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({title: '3Play_JobGrabber', enabled: false}, function() {
        logMsg('3Play_JobGrabber: State initialized.');
    });

    chrome.storage.sync.get('refreshRate', function(result) {
        if (result.refreshRate === undefined) {
            logMsg('refreshRate undefined. Default: 10 seconds');
            chrome.storage.sync.set({refreshRate: 10}, function() {});
        } else {
            logMsg('refreshRate=' + result.refreshRate);
        }
    });

    // runs on all pages
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {urlContains: ''} // TODO: add job market URL
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

function logMsg(message) {
    console.log(message);
    // let queryInfo = { active: true, currentWindow: true };
    // chrome.tabs.query(queryInfo, function(tabs) {
    //     chrome.tabs.executeScript(tabs[0].id, { code: 'console.log("' + message + '");' });
    // });
}
