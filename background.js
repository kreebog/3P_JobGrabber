// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
let debug = true;
let clinkCount = 0;

console.log('3Play_JobGrabber Extension Activated');

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ title: '3Play_JobGrabber', enabled: false }, function() {
        logPageMsg('3Play_JobGrabber: State initialized.');
        //        playSound('/sounds/bongo_riff.wav');
    });

    chrome.storage.sync.set({ debug: debug }, function() {
        if (debug) {
            logPageMsg('3Play_JobGrabber: Debug Mode Enabled.');
        }
    });

    chrome.storage.sync.get('refreshRate', function(result) {
        if (result.refreshRate === undefined) {
            logPageMsg('refreshRate undefined. Default: 10 seconds');
            chrome.storage.sync.set({ refreshRate: 10 }, function() {});
        } else {
            logPageMsg('refreshRate=' + result.refreshRate);
        }
    });

    chrome.runtime.onMessage.addListener(function(message, callback) {
        switch (message.action) {
            case 'updateIcon': {
                logPageMsg('updateIcon(' + message.value + ')');
                let iconImage = '/images/bee_{COLOR}_32.png'.replace('{COLOR}', message.value);

                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.pageAction.setIcon({ tabId: tabs[0].id, path: iconImage });
                });

                logPageMsg('updateIcon(' + message.value + ') : Icon set to ' + iconImage);
                break;
            }
            case 'playSound': {
                logPageMsg('Message: playSound -> ' + message.value);
                if (message.value == 'NEW_JOB') {
                    clinkCount++;
                }
                break;
            }

            case 'getMarketTable': {
                logPageMsg('Message: getMarketTable');
                logPageMsg('\t' + JSON.stringify(message.value));
                break;
            }
            default: {
                console.log('No message handler for: ' + message.action);
            }
        }
    });

    // runs on all pages
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'jobs.3playmedia.com/available_jobs' }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

function playClink() {
    if (clinkCount > 0) {
        playSound('sounds/glass_clink.wav');
        clinkCount--;
    }
}

// play a sound!
function playSound(soundFile) {
    let sound = new Audio();
    sound.src = soundFile;
    sound.play();
}

function logPageMsg(message) {
    console.log(message);
}

let clinkTimer = setInterval(playClink, 100);
