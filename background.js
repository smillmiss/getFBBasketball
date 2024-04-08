chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request.action);
    if (request.action === "postJson") {
        fetch(request.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request.data),
        })
            .then((response) => {
                // 检查 Content-Type 是否为 JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    // 解析为 JSON
                    return response.json();
                } else {
                    // 解析为文本
                    return response.text();
                }
            })
            .then((data) => sendResponse({ status: "success", data }))
            .catch((error) => sendResponse({ status: "error", error }));
        return true;
    } else if (request.action === "postForm") {
        const formData = new FormData();
        for (const key in request.formData) {
            formData.append(key, request.formData[key]);
        }
        fetch(request.url, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                // 检查 Content-Type 是否为 JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    // 解析为 JSON
                    return response.json();
                } else {
                    // 解析为文本
                    return response.text();
                }
            })
            .then((data) => sendResponse({ status: "success", data }))
            .catch((error) => sendResponse({ status: "error", error }));
        return true;
    }  else if (request.action === "get") {
        fetch(request.url, {
            method: "GET"
        })
            .then((response) => {
                // 检查 Content-Type 是否为 JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    // 解析为 JSON
                    return response.json();
                } else {
                    // 解析为文本
                    return response.text();
                }
            })
            .then((data) => sendResponse({ status: "success", data }))
            .catch((error) => sendResponse({ status: "error", error }));
        return true;
    } else if (request.action === "putValue") {
        storage.put(request.key, request.value)
        let value = request.value;
        sendResponse({status: "success", data:value})
    } else if (request.action === "getValue") {
        let value = storage.get(request.key)
        sendResponse({status: "success", data:value})
    } else if (request.action === "putOrAddIntValue") {
        let value = storage.get(request.key);
        if (value == null){
            value = 0;
        }
        value = value + 1;
        storage.put(request.key, value)
        sendResponse({status: "success", data:value})
    }
});

console.log("background.js")

class ExpiringStorage {
    constructor(expirationInSeconds) {
        this.storage = new Map();
        this.expirationInSeconds = expirationInSeconds;
    }

    put(key, value) {
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds

        // Check if the key already exists and has not expired
        const storedData = this.storage.get(key);
        if (storedData && storedData.expirationTime > currentTime) {
            this.storage.set(key, { value, expirationTime: storedData.expirationTime });
        } else {
            const expirationTime = currentTime + this.expirationInSeconds;
            this.storage.set(key, { value, expirationTime });
        }
    }

    get(key) {
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
        const storedData = this.storage.get(key);

        if (storedData && storedData.expirationTime > currentTime) {
            return storedData.value;
        } else {
            this.storage.delete(key);
            return null;
        }
    }
}

const storage = new ExpiringStorage(14400);




