// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

console.log('3Play_JobGrabber Extension Active');

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ color: '#3aa757' }, function() {
        console.log('color value stored?');
    });

    // runs on all pages
    new chrome.declarativeContent.ShowPageAction();

    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //     chrome.declarativeContent.onPageChanged.addRules([
    //         {
    //             conditions: [
    //                 new chrome.declarativeContent.PageStateMatcher({
    //                     pageUrl: { urlContains: '3play...' } // TODO: add job market URL
    //                 })
    //             ],
    //             actions: [new chrome.declarativeContent.ShowPageAction()]
    //         }
    //     ]);
    // });
});
