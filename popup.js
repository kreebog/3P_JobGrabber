console.log('popup_js.loaded()');
// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
//     });
// };

btnToggle.onclick = function(element) {
    console.log('btnToggle.onClick()');

    if ($('#btnToggle').hasClass('on')) {
        $('#btnToggle').removeClass('on');
        $('#btnToggle').addClass('off');
        $('#btnToggle').html('OFF');
        console.log('Button Off');
    } else {
        $('#btnToggle').removeClass('off');
        $('#btnToggle').addClass('on');
        $('#btnToggle').html('ON');
        console.log('Button On');
    }

    // $('#btnToggle').chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //     chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
    // });
};
