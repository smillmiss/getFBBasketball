const betSuccess = 1;   //下注成功
const startToBet = 2;   //准备开始下注状态
const betUpdate = 3;    //有更新
const unBet = 0;    //未下注
const betting = 4;   //正在下注
const unKnowState = 5;  //未知状态
const timeOver = 6;     //盘口关闭
const confirmBet = 7;   //确认下注
const betResultChange = 8   //下注结果有变化或无变化
const betError = 9 //下注时错误

/**
 * 获取是否存在下注窗口
 * @returns {boolean}
 */
function haveBetWindow(){
    return document.getElementsByClassName("betting-main").length>0;
}


/**
 * 可以唯一判定是否开始下注 startToInputMoney
 * @returns {boolean}
 */
function haveInputZero(){
    let moneyEl = document.getElementsByClassName('can-win-profit');
    if (moneyEl.length>0){
        if (moneyEl[0].textContent == '0.00'){
            return true;
        }else {
            return false;
        }
    }else {
        return false;
    }
}

//////////////////////////////////////////////

function isValidFormat(str) {
    // 正则表达式解释：
    // ^ 表示字符串的开始
    // (?!0+\.0*$) 确保整个数字不是0.0或其变体（例如00.00）
    // \d+ 表示一个或多个数字（整数部分）
    // \. 表示小数点
    // \d+ 表示一个或多个数字（小数部分）
    // (?!.*\.0+$) 避免整个数字以.0结尾（这个检查实际上是多余的，因为前面的检查已经足够）
    // $ 表示字符串的结束
    const regex = /^(?!0+\.0*$)\d+\.\d+$/;
    return regex.test(str);
}
/**
 * 可以唯一判定是否输入完成 inputMoneyFinish
 * @returns {boolean}
 */
function haveInputNotZero(){
    let moneyEl = document.getElementsByClassName('can-win-profit');
    if (moneyEl.length>0){
        if (isValidFormat(moneyEl[0].textContent)){
            return true;
        }else {
            return false;
        }
    }else {
        return false;
    }
}

/////////////////////////////////////////////////
/**
 * 可以唯一判断是否存在错误信息
 * @returns {boolean}
 */
function haveErrorMsg() {
    let el = getElementByXPath("//div[@class='error' and not(contains(@style, 'display:none'))]")
    if (el != null){
        return true;
    }else {
        return false;
    }
}

///////////////////////////////////////////////////
/**
 * 可以唯一判断是否在下注等待中
 * @returns {boolean}
 */
function isBetting() {
    let el = getElementByXPath("//div[@class='name font-impact']/p/span[text()='注单确认中']")
    if (el != null){
        return true;
    }else {
        return false;
    }
}


///////////////////////////////////////////////////

/**
 * 可以唯一判断是否在下注等待中
 * @returns {boolean}
 */
function isBetSuccess() {
    let el = getElementByXPath("//div[@class='name font-impact']/p/span[text()='投注成功']")
    if (el != null){
        return true;
    }else {
        return false;
    }
}

///////////////////////////////////////////////////

/**
 * 可以唯一判断是否在下注等待中
 * @returns {boolean}
 */
function isBetError() {
    let el = getElementByXPath("//div[@class='name font-impact']/p/span[contains(.,'投注失败')]")
    if (el != null){
        return true;
    }else {
        return false;
    }
}


////////////////////////////////////////////////
function getBetInfo() {
    let result = {};
    let teamNames = document.getElementsByClassName('mach-info-name');
    let betType = document.getElementsByClassName('market-name')
    let betSide = getElementByXPath("//div[contains(@class,'match-option-name')]/div/span[1]")
    let betMultiply = getElementByXPath("//div[contains(@class,'match-option-name')]/div/span[2]/span[2]");
    if (teamNames.length>0){
        teamNames = teamNames[0].textContent;
        let a = teamNames.split('vs.');
        result['teamNameOne'] = a[0].trim();
        result['teamNameTwo'] = a[1].trim();
    }
    if (betType.length>0){
        betType = betType[0].textContent;
        result['betType'] = betType;
    }
    if (betSide!=null){
        let betInfo = betSide.textContent;
        let b = betInfo.split(' ');
        result['betSide'] = b[0];
        result['betAddScore'] = b[1];
    }
    if (betMultiply!=null){
        result['betMultiply'] = betMultiply.textContent;
    }
    return result;
}


///////////////////////////////////////////////////////////
function simulateKeyboardInput(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(element, value);

    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
}

/////////////////////////////////////
function getInputEl() {
    return getElementByXPath("//div[@class='amount-input-box']/input");
}

function getDeleteButton() {
    return getElementByXPath("//i[contains(@class,'delete-btn')]");
}

//////////////////////////////////////////////
function getConfirmButton() {
    return getElementByXPath("//button/span[contains(@class,'q-btn__wrapper')]/span[contains(.,'确认投注')]");
}

//////////////////////////////////////////////
function getConfirmSuccessButton() {
    return getElementByXPath("//button/span[contains(@class,'q-btn__wrapper')]/span[contains(.,'确定')]");
}

/**
 * 检查下注状态 会返回
 * @param betHtml
 */
function checkState() {
    if (!haveBetWindow()){
        return unBet;
    }
    if (haveInputZero()){
        return startToBet
    }

    if (haveInputNotZero()){
        return confirmBet;
    }
    if (haveErrorMsg()){
        return betUpdate;
    }
    if (isBetting()){
        return betting;
    }
    if (isBetSuccess()){
        return betSuccess;
    }
    if (isBetError()){
        return betError;
    }

    return unKnowState;
}



let sendLog = function (logString) {
    let formdata = new FormData();
    formdata.append("logString", logString);
    $.ajax({
        url: 'http://localhost:8080/receiveLog/receive',
        type: 'POST',
        data: formdata,                    // 上传formdata封装的数据
        dataType: 'JSON',
        cache: false,                      // 不缓存
        processData: false,                // jQuery不要去处理发送的数据
        contentType: false,                // jQuery不要去设置Content-Type请求头
        success: function (data) {           //成功回调
        }
    });
};

let sendInstructions = function (instructions, callBack) {
    let formdata = new FormData();
    formdata.append("instructions", JSON.stringify(instructions));
    $.ajax({
        url: 'http://localhost:8080/rotot/run',
        type: 'POST',
        data: formdata,                    // 上传formdata封装的数据
        dataType: 'JSON',
        cache: false,                      // 不缓存
        processData: false,                // jQuery不要去处理发送的数据
        contentType: false,                // jQuery不要去设置Content-Type请求头
        success: function (data) {           //成功回调
            if (callBack != undefined) callBack();
        }
    });
};

document.isBatting = false;

document.betTimeOutTimer = null; //  下注倒计时 若超过一定时间则说明页面卡住需要重新刷新页面

document.doBatTime = null;      //用于记录触发下注的时间，

function getState(state) {
    switch (state) {
        case betSuccess:
            return 'betSuccess';
            break;
        case startToBet:
            return 'startToBet';
            break;
        case betUpdate:
            return 'betUpdate';
            break;
        case unBet:
            return 'unBet';
            break;
        case betting:
            return 'betting';
            break;
        case unKnowState:
            return 'unKnowState';
            break;
        case timeOver:
            return 'timeOver';
            break;
        case confirmBet:
            return 'confirmBet';
            break;
        case betResultChange:
            return 'betResultChange';
        case betError:
            return 'betError';
        default :
            return 'Error';
    }
}

let bettingInfo = {};


let dealObserveFunction = function (betHandle, htmlNode) {
    let state = checkState();
    console.log(getState(state));
    switch (state) {
        case betSuccess: {
            let confirmSuccessButton = getConfirmSuccessButton();
            confirmSuccessButton.click();
            clearBetTimer();
            putOrAddIntValue(bettingInfo.teamNameOne+"_"+bettingInfo.teamNameTwo)
            putOrAddIntValue(bettingInfo.teamNameTwo+"_"+bettingInfo.teamNameOne)
            document.isBatting = false;
            console.log('betSuccess isBatting false');

        }
            break;
        case startToBet: {
            document.isBatting = true;
            /**
             * 若是刚开始输入
             */
            let inputEl = getInputEl();
            if (document.betMoney == undefined || document.betMoney == '' || document.betMoney==null){
                document.betMoney = '10'
            }
            simulateKeyboardInput(inputEl, document.betMoney+"");

            console.log('startToBet');

        }
            break;
        case betUpdate: {        //当比分更新的时候
            getDeleteButton().click();
            clearBetTimer();
            console.log('betUpdate');
        }
            break;
        case unBet:
            console.log('unBet isBatting '+document.isBatting);
            clearBetTimer();
            console.log('unBet');
            break;
        case betting:
            console.log('betting');
            break;
        case betError:
            getConfirmSuccessButton().click();
            console.log('betError');
            break;
        case unKnowState:
            document.isBatting = false;
            console.log('unKnowState isBatting false');
            console.log('unKnowState');
            break;
        case confirmBet: {
            document.isBatting = true;
            let betInfo = getBetInfo()
            bettingInfo = deepCopy(betInfo);
            let competitionAir = 'null';
            let teamNameOne = betInfo.teamNameOne;
            let teamNameTwo = betInfo.teamNameTwo;
            let betType = betInfo.betType; //'滚球篮球 / 让球'
            let betSideName = betInfo.betSide;
            let betAddScore = betInfo.betAddScore;
            let betMultiply = betInfo.betMultiply;
            console.log("competitionAir:" + competitionAir);
            console.log("teamNameOne:" + teamNameOne);
            console.log("teamNameTwo:" + teamNameTwo);
            console.log("betType:" + betType);
            console.log("betSideName:" + betSideName);
            console.log("betAddScore:" + betAddScore);
            console.log("betMultiply:" + betMultiply);
            // if (document.battingKey != null && document.battingKey != undefined) {
                // if (canBetFinal(document.battingKey, competitionAir, teamNameOne, teamNameTwo, betType, betSideName, betAddScore, betMultiply)) {
            if (true) {
                if (true) {
                    let confirmButton = getConfirmButton();
                    confirmButton.click();
                } else {
                    let deleteButton = getDeleteButton();
                    deleteButton.click();
                }
            } else {
                let deleteButton = getDeleteButton();
                deleteButton.click();
            }
            console.log('confirmBet isBatting false');

            console.log("confirmBet");
            document.battingKey = null;
        }

            break;
        default:
            document.isBatting = false;
            console.log('default isBatting false');
            clearBetTimer();
    }
};




/**
 * 将投注结果返回后台
 * @param betHandle
 */
function getBetResult(betHandle){
    let successNumber = betHandle.getByArray([0,0]).getChildElementSize();
    let betResultList = [];
    for (let i = 0; i < successNumber; i++) {
        let successItem = new Item(betHandle.getByArray([0,0,i]).getElement());
        let betResult = {};
        betResult.teamNameOne = successItem.getInnerTextByArray([0,0,2,0,0]); //必填
        betResult.teamNameTwo = successItem.getInnerTextByArray([0,0,2,0,1]); //必填
        betResult.betId = successItem.reset().getAttr('id');         //必填
        betResultList.push(betResult);
        console.log(JSON.stringify(betResult))
    }
    let saveObject = countTeamNames(betResultList);
    putValue("saveObject",saveObject)
}

function countTeamNames(teamArray) {
    const resultMap = {};
    teamArray.forEach(team => {
        const key1 = team.teamNameOne + team.teamNameTwo;
        const key2 = team.teamNameTwo + team.teamNameOne;
        if (resultMap.hasOwnProperty(key1)) {
            resultMap[key1]++;
        } else {
            resultMap[key1] = 1;
        }

        if (resultMap.hasOwnProperty(key2)) {
            resultMap[key2]++;
        } else {
            resultMap[key2] = 1;
        }
    });

    return resultMap;
}


//清除下注计时器
function clearBetTimer() {

}

//544 289 real
//539 301 now +5 -12
function currentFrameAbsolutePosition(currentElement) {
    let currentWindow = currentElement.ownerDocument.defaultView;
    let currentParentWindow;
    let positions = [];
    let rect;

    while (currentWindow !== window.top) {
        currentParentWindow = currentWindow.parent;
        try {
            for (let idx = 0; idx < currentParentWindow.frames.length; idx++)
                if (currentParentWindow.frames[idx] === currentWindow) {
                    let iframeArray = currentParentWindow.document.getElementsByTagName('iframe');
                    let frameArray = currentParentWindow.document.getElementsByTagName('frame');
                    for (let frameElement of iframeArray) {
                        if (frameElement.contentWindow === currentWindow) {
                            rect = frameElement.getBoundingClientRect();
                            positions.push({x: rect.x, y: rect.y});
                        }
                    }
                    for (let frameElement of frameArray) {
                        if (frameElement.contentWindow === currentWindow) {
                            rect = frameElement.getBoundingClientRect();
                            positions.push({x: rect.x, y: rect.y});
                        }
                    }
                    currentWindow = currentParentWindow;
                    break;

                }
        } catch (e) {   //there might be a Exception  (DOMException: Blocked a frame with origin "http://xxx.xxx" from accessing a cross-origin frame.)
            break;
        }
    }
    return positions.reduce((accumulator, currentValue) => {
        return {
            x: accumulator.x + currentValue.x,
            y: accumulator.y + currentValue.y
        };
    }, {x: 0, y: 0});
}

//newBB 受跨域影响y轴向下偏移261像素，x轴不变
function getAbsoluteXY(element) {
    var subX = 7;       //需要工具浏览器进行偏差调整 引起该误差的原因是浏览器头部还有其他信息
    var subY = 114;
    var height = element.offsetHeight || element.clientHeight;
    var width = element.offsetWidth || element.clientWidth;
    var iframeXY = currentFrameAbsolutePosition(element);
    return [subX + window.screenLeft + (element.getBoundingClientRect().x) + iframeXY.x, subY + window.screenTop + (element.getBoundingClientRect().y) + iframeXY.y, width, height];
}

/**
 * 获取该元素在真实电脑里的数据用于驱动键盘点击
 * @param element
 * @returns {*[]}
 */
function getArmXY(element) {
    var data = getAbsoluteXY(element);
    return [data[0] + (data[2] / 2), data[1] + (data[3] / 2)];
}

/**
 * 将下注key与当前的页面下注显示进行比较若比较合格则进行下注处理
 * @param key
 * @param competitionAir
 * @param teamNameOne   加减分必填               大小分必填             独赢必填
 * @param teamNameTwo   加减分必填               大小分必填             独赢必填
 * @param betType                              大小分必填（大小盘）
 * @param betSideName                          大小分必填（大/小）
 * @param betAddScore   加减分必填（+1.5/-1.5）   大小分必填（120.5）
 * @param betMultiply   加减分必填               大小分必填             独赢必填
 */
function canBetFinal(key, competitionAir, teamNameOne, teamNameTwo, betType, betSideName, betAddScore, betMultiply) {
    let betInfos = key.split(';')
    let key_competitionAir = betInfos[1];
    let key_teamNameOne = betInfos[2];
    let key_teamNameTwo = betInfos[3];
    // if (competitionAir != key_competitionAir) return false;
    if (key_teamNameOne != teamNameOne && key_teamNameOne != teamNameTwo && key_teamNameTwo != teamNameOne && key_teamNameTwo != teamNameTwo) {
        return false;
    }
    if (betInfos.length == 7) {
        let key_betAddScore = betInfos[4];
        let key_betMultiply = betInfos[5];
        if ((parseFloat(betAddScore) < parseFloat(key_betAddScore)) || (parseFloat(betMultiply) < parseFloat(key_betMultiply))) {
            return false;
        }
        return true;
    } if (betInfos.length == 6){
        let key_betAddScore = betInfos[4];
        let key_betMultiply = betInfos[5];
        if (betType.indexOf('大小') > 0){
            key_betAddScore = key_betAddScore.substr(2);
        }
        if (betSideName == "大"){
            if ((parseFloat(betAddScore) > parseFloat(key_betAddScore)) || (parseFloat(betMultiply) < parseFloat(key_betMultiply))) {
                return false;
            }
            return true;
        }else {
            if ((parseFloat(betAddScore) < parseFloat(key_betAddScore)) || (parseFloat(betMultiply) < parseFloat(key_betMultiply))) {
                return false;
            }
            return true;
        }
    }else {
        let key_betMultiply = betInfos[4];
        if ((betMultiply < key_betMultiply)) {
            return false;
        }
        return true;
    }
}

/**
 *         let htmlNode = document.getElementById("mainSection");
 *         let betHandle = new Item(htmlNode);
 */
$(function () {
    let interval = setInterval(function () {
        dealObserveFunction();
    }, 1000); //启动,func不能使用括号
});
