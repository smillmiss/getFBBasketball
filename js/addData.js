function doAddData() {      //框架代码
    //采集数据并发送回后台
    sendSingleData();
    return true;        //返回true表示操作成功
}

function UnicodeDecode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

dataToElement = new Map();
let splitString = ";";
function getTeamOneAddKey(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameOne + splitString + realTimeBetDataEntity.teamNameTwo  + splitString + realTimeBetDataEntity.teamOneAddScore  + splitString + realTimeBetDataEntity.teamOneAddMultiply  + splitString + (parseInt(realTimeBetDataEntity.teamScoreOne) + parseInt(realTimeBetDataEntity.teamScoreTwo));
}
function getTeamTwoAddKey(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameTwo + splitString + realTimeBetDataEntity.teamNameOne  + splitString + realTimeBetDataEntity.teamTwoAddScore  + splitString + realTimeBetDataEntity.teamTwoAddMultiply  + splitString + (parseInt(realTimeBetDataEntity.teamScoreTwo) + parseInt(realTimeBetDataEntity.teamScoreOne));
}

function getTeamOneWinKey(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameOne + splitString + realTimeBetDataEntity.teamNameTwo  + splitString + realTimeBetDataEntity.teamOneWinMultiply ;
}

function getTeamTwoWinKey(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameTwo + splitString + realTimeBetDataEntity.teamNameOne  + splitString + realTimeBetDataEntity.teamTwoWinMultiply ;
}

function getScoreSumBigKey(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameOne + splitString + realTimeBetDataEntity.teamNameTwo  + splitString + realTimeBetDataEntity.teamOneScoreSum  + splitString + realTimeBetDataEntity.teamOneScoreSumMultiply ;
}

function getScoreSumSmallKey(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameTwo + splitString + realTimeBetDataEntity.teamNameOne  + splitString + realTimeBetDataEntity.teamTwoScoreSum  + splitString + realTimeBetDataEntity.teamTwoScoreSumMultiply ;
}

function getScoreSumBigKeyReserve(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameTwo + splitString + realTimeBetDataEntity.teamNameOne  + splitString + realTimeBetDataEntity.teamOneScoreSum  + splitString + realTimeBetDataEntity.teamOneScoreSumMultiply ;
}

function getScoreSumSmallKeyReserve(realTimeBetDataEntity) {
    return realTimeBetDataEntity.fromWhere + splitString + realTimeBetDataEntity.competitionAir + splitString + realTimeBetDataEntity.teamNameOne + splitString + realTimeBetDataEntity.teamNameTwo  + splitString + realTimeBetDataEntity.teamTwoScoreSum  + splitString + realTimeBetDataEntity.teamTwoScoreSumMultiply ;
}

function sendSingleData() {
    // console.log("开始采集");
    dataToElement.clear();  //清除map释放引用
    var BBroot = new Item(document.getElementsByClassName("home-match-list-box")[0]);
    var resultArray = new Array();
    var bodyNumber = BBroot.getChildElementSize();
    for (var i = 0; i < bodyNumber; i++) {
        var areaSection = new Item(BBroot.reset().getByArray([i]).getElement());
        let competitionAir = areaSection.getInnerTextByArray([0, 0, 0, 0]);
        for (let j = 0; j < areaSection.getByArray([0]).getChildElementSize() - 1; j++) {
            let tBody = new Item(areaSection.getByArray([0, j + 1]).getElement());//已经到底层结构
            let firstResult = {};
            firstResult.fromWhere = 'FB_basketball';
            firstResult.competitionAir = competitionAir;
            firstResult.teamScoreOne = tBody.reset().getInnerTestByArray([0, 0, 1, 0, 1, 0]);
            firstResult.teamScoreTwo = tBody.reset().getInnerTestByArray([0, 0, 1, 0, 1, 1]);
            firstResult.gameTimeQuarter = tBody.reset().getInnerTestByArray([0, 0, 0, 0, 0, 0]);
            firstResult.gameTimeMinute = tBody.reset().getInnerTestByArray([0, 0, 0, 0, 0, 1]);
            firstResult.teamNameOne = tBody.reset().getInnerTestByArray([0, 0, 1, 0, 0, 0]);
            firstResult.teamNameTwo = tBody.reset().getInnerTestByArray([0, 0, 1, 0, 0, 1]);

            firstResult.teamOneAddScore = tBody.getInnerTestByArray([0,0,2,0,1,0,0,0,0,0,0,0]);
            firstResult.teamOneAddMultiply = tBody.getInnerTestByArray([0,0,2,0,1,0,0,0,0,0,0,1]);
            firstResult.teamTwoAddScore = tBody.getInnerTestByArray([0,0,2,0,1,0,0,0,1,0,0,0]);
            firstResult.teamTwoAddMultiply = tBody.getInnerTestByArray([0,0,2,0,1,0,0,0,1,0,0,1]);
            firstResult.teamOneScoreSum = tBody.getInnerTestByArray([0,0,2,0,2,0,0,0,0,0,0,0]);
            firstResult.teamOneScoreSumMultiply = tBody.getInnerTestByArray([0,0,2,0,2,0,0,0,0,0,0,1]);
            firstResult.teamTwoScoreSum = tBody.getInnerTestByArray([0,0,2,0,2,0,0,0,1,0,0,0]);
            firstResult.teamTwoScoreSumMultiply = tBody.getInnerTestByArray([0,0,2,0,2,0,0,0,1,0,0,1]);

            firstResult.teamOneWinMultiply = tBody.getInnerTestByArray([0,0,2,0,0,0,0,0,0,0,0,1]);
            firstResult.teamTwoWinMultiply = tBody.getInnerTestByArray([0,0,2,0,0,0,0,0,1,0,0,1]);
            firstResult.teamEqualMultiply = '';
            dealTeamScoreAdd(firstResult);
            dealMultiply(firstResult);
            if (firstResult.teamOneAddMultiply != null && firstResult.teamOneAddMultiply != undefined && firstResult.teamOneAddMultiply != "") {
                dataToElement.set(getTeamOneAddKey(firstResult), tBody.getByArray([0,0,2,0,1,0,0,0,0,0,0,1]).getElement());
            }
            if (firstResult.teamTwoAddMultiply != null && firstResult.teamTwoAddMultiply != undefined && firstResult.teamTwoAddMultiply != "") {
                dataToElement.set(getTeamTwoAddKey(firstResult), tBody.getByArray([0,0,2,0,1,0,0,0,1,0,0,1]).getElement());
            }
            if (firstResult.teamOneWinMultiply != null && firstResult.teamOneWinMultiply != undefined && firstResult.teamOneWinMultiply != "") {
                dataToElement.set(getTeamOneWinKey(firstResult), tBody.getByArray([0,0,2,0,0,0,0,0,0,0,0,1]).getElement());
                dataToElement.set(getTeamTwoWinKey(firstResult), tBody.getByArray([0,0,2,0,0,0,0,0,1,0,0,1]).getElement());
            }
            if (firstResult.teamOneScoreSumMultiply != null && firstResult.teamOneScoreSumMultiply != undefined && firstResult.teamOneScoreSumMultiply != "") {
                dataToElement.set(getScoreSumBigKey(firstResult), tBody.getByArray([0,0,2,0,2,0,0,0,0,0,0,1]).getElement());
                dataToElement.set(getScoreSumSmallKey(firstResult), tBody.getByArray([0,0,2,0,2,0,0,0,1,0,0,1]).getElement());
                dataToElement.set(getScoreSumBigKeyReserve(firstResult), tBody.getByArray([0,0,2,0,2,0,0,0,0,0,0,1]).getElement());
                dataToElement.set(getScoreSumSmallKeyReserve(firstResult), tBody.getByArray([0,0,2,0,2,0,0,0,1,0,0,1]).getElement());
            }
            if (filter(firstResult)) {
                resultArray.push(firstResult);
            }
        }
    }

    sendDataNewBB(resultArray);
}



/**
 * 将1.86的赔率转换为0.86 进行数据一致性处理
 * @param item
 */
function dealMultiply(item) {
    if (!isEmpty(item.teamOneAddMultiply)) {
        item.teamOneAddMultiply = (item.teamOneAddMultiply - 1).toFixed(2) + "";
    }
    if (!isEmpty(item.teamTwoAddMultiply)) {
        item.teamTwoAddMultiply = (item.teamTwoAddMultiply - 1).toFixed(2) + "";
    }
    if (!isEmpty(item.teamOneScoreSumMultiply)) {
        item.teamOneScoreSumMultiply = (item.teamOneScoreSumMultiply - 1).toFixed(2) + "";
    }
    if (!isEmpty(item.teamTwoScoreSumMultiply)) {
        item.teamTwoScoreSumMultiply = (item.teamTwoScoreSumMultiply - 1).toFixed(2) + "";
    }
    if (!isEmpty(item.teamOneWinMultiply)) {
        item.teamOneWinMultiply = (item.teamOneWinMultiply - 1).toFixed(2) + "";
    }
    if (!isEmpty(item.teamTwoWinMultiply)) {
        item.teamTwoWinMultiply = (item.teamTwoWinMultiply - 1).toFixed(2) + "";
    }
}

/**
 * 是否需要传输到后端进行处理，若比赛没有时间等不符合常理则在此处进行抛弃
 * @param item
 */

function filter(item) {
    let isScoreNumber = isNumber(item.teamScoreOne);
    let isTrueGame = item.competitionAir.indexOf("最多")==-1;
    let isSBXN = item.competitionAir.indexOf("沙巴虚拟")==-1;
    return isScoreNumber && isTrueGame && isSBXN;
}

function dealTeamScoreAdd(item) {
    if (isEmpty(item.teamOneAddScore) && !isEmpty(item.teamTwoAddScore)) {
        item.teamOneAddScore = item.teamTwoAddScore;
        item.teamTwoAddScore = '-'+item.teamTwoAddScore;
    }
    if (!isEmpty(item.teamOneAddScore) && isEmpty(item.teamTwoAddScore)) {
        item.teamTwoAddScore = item.teamOneAddScore;
        item.teamOneAddScore = '-'+item.teamOneAddScore;
    }
}

function isEmpty(a) {
    if (a == undefined || a == null || a == '') return true;
    return false;
}


function isNumber(val) {
    if (isNaN(parseFloat(val))) {
        return false;
    } else {
        return true;
    }
}

function getData(data) {
    return JSON.stringify(data);
}
var bettingTimeOut = null;

function sendDataNewBB(data) {
    /**
     * 用于数据对比的服务地址 产生最新的数据
     */

    postForm("http://192.168.2.141:8080/basketball/addRealTimeBasketballData",{
        "realTimeData":getData(data),
        "fromWhere":"FB_Ba",
        "version":'1'
    },function (result) {
        console.log(result)
        let betIntent = JSON.parse(result);
        if (betIntent["betKey"] != undefined && betIntent["betKey"].length > 0 &&
            document.isBatting == false && document.stopBetting == false) {  //若存在下注目标
            canBet(betIntent["betKey"],function (){
                if (document.isBatting == true){
                    return;
                }
                document.betMoney = betIntent["betMoney"];
                let moneyElement = getElementByXPath("//span[@class = 'balance-amount-title']")
                if (moneyElement != null){
                    try {
                        let moneyString = moneyElement.textContent;
                        let betMoney = moneyString;
                        if (document.betMoney > Number(betMoney)){
                            if (betMoney <=Number(20)){
                                return;
                            }else {
                                document.betMoney = betMoney;
                            }
                        }
                    }catch (e) {
                        console.log(e);
                    }
                }
                document.battingKey = betIntent["betKey"];
                dataToElement.get(betIntent["betKey"]).click();     //报错会导致函数停止
                document.isBatting = true;
                console.log('receive betting instruction isBatting true');
                //设置超时自动将下注标志位进行重置
                bettingTimeOut = setTimeout(function () {
                    document.isBatting = false;
                    console.log('betting instruction timeout isBatting false');
                }, 20000);
            });
        }
        if ((betIntent["action"] != undefined )&& (betIntent["action"] == "refresh")) { //若接受到了后台的刷新命令则直接刷新
            // debugger;
            location.reload();
        }
    },function (res) {
        console.log(res);
    })

}

const timeMap = new Map();

function checkKeyInterval(key) {
    const currentTime = Date.now();
    const interval = 15000; // 15 seconds in milliseconds

    if (timeMap.has(key)) {
        const lastTime = timeMap.get(key);
        if (currentTime - lastTime >= interval) {
            timeMap.set(key, currentTime);
            return true;
        } else {
            return false;
        }
    } else {
        timeMap.set(key, currentTime);
        return true;
    }
}

function concatStrings(str1, str2) {
    const sortedStrings = [str1, str2].sort();
    return sortedStrings[0] + sortedStrings[1];
}

function canBet(battingKey,callBack){
    let betInfos = battingKey.split(';')
    let key_teamNameOne = betInfos[2];
    let key_teamNameTwo = betInfos[3];
    if (!checkKeyInterval(concatStrings(key_teamNameOne,key_teamNameTwo))){
        return ;
    }
    let betSumKey = key_teamNameOne+'_'+key_teamNameTwo;
    getValue(betSumKey,function (value) {
        if (value == null){
            callBack();
        }
        if (value<=1){
            callBack();
        }
    })
}


