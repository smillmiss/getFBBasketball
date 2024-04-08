var Item = (function () {
    function Item(currentNode) {
        this.oldNode = currentNode;
        this.nowNode = currentNode;
    }

    Item.prototype.get = function (index) {
        this.nowNode = this.nowNode.children[index];
        return this;
    };

    Item.prototype.getHtml = function () {
        return this.nowNode.innerHTML;
    };

    Item.prototype.getText = function () {
        return this.nowNode.innerText;
    };

    Item.prototype.reset = function () {
        this.nowNode = this.oldNode;
        return this;
    };

    Item.prototype.click = function () {
        this.nowNode.click();
        return this;
    };

    Item.prototype.getAttr = function (attr) {
        return this.nowNode.getAttribute(attr);
    };

    Item.prototype.getElement = function () {
        return this.nowNode;
    };

    Item.prototype.getChildElementSize = function () {
        if (this.nowNode.children.length == undefined) return 0;
        return this.nowNode.children.length;
    };

    Item.prototype.getByArray = function (indexArray) {
        this.reset();
        for (let i = 0; i < indexArray.length; i++) {
            let index = indexArray[i];
            if (this.nowNode == undefined) return null;
            this.get(index);
            if (this.nowNode == undefined) return null;
        }
        return this;
    };
    Item.prototype.containsArray = function (indexArray) {
        this.reset();
        for (let i = 0; i < indexArray.length; i++) {
            let index = indexArray[i];
            this.get(index);
            if (this.nowNode == undefined) return false;
        }
        return true;
    };
    Item.prototype.getInnerHtmlByArray = function (indexArray) {
        if (this.containsArray(indexArray)) {
            return this.getHtml();
        } else {
            return "";
        }
    };
    Item.prototype.getAttrByArray = function (indexArray,attr) {
        if (this.containsArray(indexArray)) {
            return this.getAttr(attr);
        } else {
            return "";
        }
    };
    Item.prototype.getInnerTextByArray = function (indexArray) {
        if (this.containsArray(indexArray)) {
            return this.getText();
        } else {
            return "";
        }
    };
    Item.prototype.getInnerTestByArray = function (indexArray) {
        if (this.containsArray(indexArray)) {
            return this.getText();
        } else {
            return "";
        }
    };
    Item.prototype.getInnerTestByXPath = function (xpath) {
        let currentNode = this.reset().getElementByXPath(xpath);
        if (currentNode !=null){
            return this.getText();
        }else {
            return "";
        }
    };
    Item.prototype.hasClass = function (className) {
        if (this.nowNode == undefined) return false;
        return this.nowNode.className.indexOf(className) !== -1;
    };
    Item.prototype.hasClassUseArray = function (indexArray,className) {
        if (this.containsArray(indexArray)) {
            return this.nowNode.className.indexOf(className) !== -1;
        }else{
            return false;
        }
    };
    Item.prototype.getClass = function () {
        return this.nowNode.className;
    };
    Item.prototype.getElementByXPath = function (xpath) {
        let element = document.evaluate(xpath,this.nowNode,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
        this.nowNode = element;
        return element;
    };
    Item.prototype.getElementsByXPath = function (xpath) {
        let result = document.evaluate(xpath, this.nowNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let nodes = [];
        if (result !== null) {
            let node;
            while ((node = result.iterateNext()) !== null) {
                nodes.push(node);
            }
        }
        return nodes;
    };
    return Item;
}());

/**
 * html 树变化监听函数
 * @param htmlNode  需要监听的html根节点
 * @param delayTime 多少时间间隔以上的变化会引发回调
 * @param callBackFunction  回调函数
 * @returns {MutationObserver}
 */
function observeHtmlUseDelay(htmlNode, delayTime, callBackFunction) {
    let getDelayCallback = function getDelayCallback(delayTime) {
        let timeOutFlag = null;
        return function (callBack, mutationsList, observer) {
            if (timeOutFlag != null) {
                clearTimeout(timeOutFlag)
            }
            timeOutFlag = setTimeout(function () {
                callBack(mutationsList, observer);
            }, delayTime);
        };
    };
    // 设置observer的配置选项
    let config = {attributes: true, childList: true, subtree: true, characterData: true};
    // 当节点发生变化时的需要执行的函数
    let delayFunction = getDelayCallback(delayTime);
    let callback = function (mutationsList, observer) {
        delayFunction(callBackFunction, mutationsList, observer);
    };
    // 创建一个observer示例与回调函数相关联
    let observer = new MutationObserver(callback);
    //使用配置文件对目标节点进行观测
    observer.observe(htmlNode, config);
    return observer;
}


function sendBetResult(betResultList){
    $.ajax({
        url: "http://localhost:8080/receiveResult/receive",
        data: JSON.stringify(betResultList),
        type: "POST",
        contentType: 'application/json',//这个一定设置为false
        processData: false,//这个一定设置为false
        success: function (result, status, xhr) {

        },
        error: function (xhr, status, error) {

        }
    });
}

function sendBetResultTotal(betResultList){
    $.ajax({
        url: "http://localhost:8080/receiveResult/receiveTotal",
        data: JSON.stringify(betResultList),
        type: "POST",
        contentType: 'application/json',//这个一定设置为false
        processData: false,//这个一定设置为false
        success: function (result, status, xhr) {

        },
        error: function (xhr, status, error) {

        }
    });
}

/**
 * 根据xpath 查找第一个匹配的element
 * @param xpath
 * @returns {Node}
 */
function getElementByXPath(xpath) {
    let element = document.evaluate(xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
    return element;
}

/**
 * 根据xpath 查找所有的element
 * @param xpath
 * @returns {*[]}
 */
function getElementsByXPath(xpath) {
    let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    let nodes = [];
    if (result !== null) {
        let node;
        while ((node = result.iterateNext()) !== null) {
            nodes.push(node);
        }
    }
    return nodes;
}

function postJson(url, data, successCallback, errorCallback) {
    chrome.runtime.sendMessage(
        { action: "postJson", url: url, data: data },
        function(response) {
            if (response.status === "success") {
                successCallback(response.data);
            } else {
                errorCallback(response.error);
            }
        }
    );
}

function postForm(url, formData, successCallback, errorCallback) {
    chrome.runtime.sendMessage(
        { action: "postForm", url: url, formData: formData },
        function(response) {
            if (response.status === "success") {
                successCallback(response.data);
            } else {
                errorCallback(response.error);
            }
        }
    );
}

function get(url, successCallback, errorCallback) {
    chrome.runtime.sendMessage(
        { action: "get", url: url },
        function (response) {
            if (response.status === "success") {
                successCallback(response.data);
            } else {
                errorCallback(response.error);
            }
        }
    );
}

function putValue(key,value) {
    chrome.runtime.sendMessage(
        {action: "putValue", key: key, value: value},
        function (response) {
            if (response.status === "success") {
                console.log('success put '+ key)
            } else {
                console.log('error put '+ key)
            }
        }
    );
}

function getValue(key,callback) {
    chrome.runtime.sendMessage(
        {action: "getValue", key: key},
        function (response) {
            if (response.status === "success") {
                callback(response.data)
            } else {
                console.log('error get '+ key)
            }
        }
    );
}

function putOrAddIntValue(key) {
    chrome.runtime.sendMessage(
        {action: "putOrAddIntValue", key: key},
        function (response) {
            if (response.status === "success") {
                console.log('success put '+ key)
            } else {
                console.log('error put '+ key)
            }
        }
    );
}

function isNumber(val) {
    if (isNaN(parseFloat(val))) {
        return false;
    } else {
        return true;
    }
}

function deepCopy(obj) {
    // 检查输入是否为对象或数组，否则直接返回
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 初始化返回结果，数组或对象
    let copy = Array.isArray(obj) ? [] : {};

    // 遍历对象属性
    for (let key in obj) {
        // 确保属性属于该对象，而不是继承自原型链
        if (obj.hasOwnProperty(key)) {
            // 递归复制所有属性
            copy[key] = deepCopy(obj[key]);
        }
    }

    return copy;
}
