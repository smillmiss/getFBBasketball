const startToInputMoney = 2;   //准备开始输入金额
const inputMoneyFinish = 9;   //金额输入完成
const betUpdate = 3;    //有更新
const unBet = 0;    //未下注
const betting = 4;   //正在下注
const unKnowState = 5;  //未知状态
const timeOver = 6;     //盘口关闭
const confirmBet = 7;   //确认下注
const betResultChange = 8   //下注结果有变化或无变化
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
function getElementByXPath(xpath) {
    let element = document.evaluate(xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
    return element;
}

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
function betSuccess() {
    let el = getElementByXPath("//div[@class='name font-impact']/p/span[text()='投注成功']")
    if (el != null){
        return true;
    }else {
        return false;
    }
}


////////////////////////////////////////////////
function getTeamName() {
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




let status = unBet;

let interval = setInterval(function () {
    if (!haveBetWindow()){
        status = unBet;
        return;
    }

    debugger;
    /**
     * 若是刚开始输入
     */
    if (haveInputZero()){
        let inputEl = getInputEl();
        simulateKeyboardInput(inputEl,"50");
        let confirmButton = getConfirmButton();
        confirmButton.click();
    }
    /**
     * 若是正在下注则直接跳过
     */
    if (isBetting()){
        return;
    }
    /**
     * 若中途有变化
     */
    if (haveErrorMsg()){
        let deleteButton = getDeleteButton();
        deleteButton.click();
        return;
    }

    if (betSuccess()){
        let a = getConfirmSuccessButton();
        a.click();
        return;
    }


}, 500); //启动,func不能使用括号