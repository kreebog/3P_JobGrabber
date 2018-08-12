let mktTbl = document.getElementById('market_table');

chrome.runtime.sendMessage({
    action: 'getMarketTable',
    value: mktTbl.innerText
});
