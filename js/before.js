document.stopBetting = false;

function selectHongMultiply() {
    let choseList = document.getElementsByClassName("c-dropdown-menu__btn");
    if (choseList.length == 2){
        let choseItem = new Item(choseList[1]);
        if (choseItem.getHtml().indexOf("欧洲盘")>=0){
            choseItem.click();
            setTimeout(function (){
                document.getElementsByClassName("c-dropdown-menu__item c-icon c-icon--odds-china")[0].click();
            },300);
        }
    }
}

function doBefore() {
    /**
     * 选择滚球篮球
     * @type {Node}
     */
    selectPlayingBasketball();
    return true;        //返回true表示操作成功
}

let hasCash = false;    //是否出现等待中比赛

/**
 * 选择结果列表
 * @param refresh
 * @returns {boolean}
 */
function selectBetResultPage(refresh) {
    if (document.isBatting == false || document.stopBetting == true) {   //
        document.isBatting = false;

        if (getElementByXPath("//div/div/div[@class='c-betting ']") == null) {
            let activeHistory = getElementByXPath("//div[contains(@class,'c-is-selected') and @title='投注历史']/div");
            if (activeHistory == null) {
                getElementByXPath("//div[ contains(@class,'c-side-betting') and @title='投注历史']/div").click();
                console.log("selectBetResultPage()1")
                return true;
            }
            let activeBetting = getElementByXPath("//div[  @title='进行中' and @data-selected='false']/span");
            if (activeBetting != null) {
                activeBetting.click();
                console.log("selectBetResultPage()2")
                return true;
            }
        }
        return false;
    }
}

function getBetIndex(betPage){
    //c-side-bets
    for (let i = 0; i < betPage.getByArray([0, 0, 0, 0]).getChildElementSize(); i++) {
        let currentClass = betPage.getByArray([0, 0, 0, 0, i]).getAttr("class");
        if (currentClass.indexOf('c-side-bets')>=0){
            return i;
        }
    }
    return -1;
}

/**
 * 若有广告弹窗则直接关闭 关闭动作返回true 否则返返回false
 */
function closePopWindow() {
    let closeButton1 = getElementByXPath("//div[@class='c-modal__container']/div[@class='c-btn c-icon c-icon--clear']")
    if (closeButton1 !=null){
        closeButton1.click();
        console.log("closePopWindow()1")
        return true;
    }
    let closeButton2 = getElementByXPath("//div[@class='c-btn c-btn--primary' and text()='確定']")
    if (closeButton2 !=null){
        closeButton2.click();
        console.log("closePopWindow()2")
        return true;
    }
    return  false;
}

/**
 * 选择滚球篮球
 * @type {Node}
 */
function selectPlayingBasketball() {
    /**
     * 选择滚球篮球
     * @type {Node}
     */
    let selectBasketball = getElementByXPath("//div[@class='ui-carousel-item sport-type-item']/div[@class='sport-list-item']/p/span[contains(.,'篮球')]");
    if (selectBasketball != null){
        selectBasketball.click();
    }
}
