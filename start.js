// popup主动发消息给content-script
$('#startCollectionData').click(() => {
    sendMessageToContentScript({'run':true, 'resource': 'controllerNewBB'}, (response) => {
    if(response) console.log('receive:'+response);
});
});
// popup主动发消息给content-script
$('#stopCollectionData').click(() => {
    sendMessageToContentScript({'run':false, 'resource': 'controllerNewBB'}, (response) => {
        if(response) console.log('receive:'+response);
    });
});


// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        if (tabId) {
            // 使用 chrome.tabs.sendMessage 而不是 chrome.runtime.sendMessage
            chrome.tabs.sendMessage(tabId, message, function(response) {
                if (callback) callback(response);
            });
        } else {
            console.error("Cannot find the active tab ID.");
        }
    });
}

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}
