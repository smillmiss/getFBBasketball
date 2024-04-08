var run = true;
window.setInterval(function () { //默认为5秒钟采集一次 框架代码
    let dataTable = document.getElementById("q-app");
    if ((dataTable!=null) && (dataTable !=undefined)){
    if (run){
        if (document.URL.indexOf("ipc") >=0){
            if (doBefore()==true){
                doAddData();
                doAfter();
            }else {
                return;
            }
        }
    }
}},2000);

console.log('注入成功：'+document.URL);
// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
//    console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    if (request['resource'] != null &&request['resource']!=undefined&&request['resource']=='controllerNewBB'){
        sendResponse('我收到你的消息了：'+JSON.stringify(request));
    }else {
        return;
    }
    if (request['run']!=null&&request['run']!=undefined){
        run = request['run'];
    }
});

/**
 * 专门给鑫胜做的自动刷新机制
 */
if (document.URL.indexOf("Sports") > 0) {
    window.setInterval(function () { //默认为5秒钟采集一次 框架代码
        document.location.reload();
    }, 3600000);
}


setTimeout(function (){
    getElementByXPath("//a[@class='c-btn c-btn--icon']/i[@title='刷新']").click();
},20000)
