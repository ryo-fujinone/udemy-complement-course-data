const getFromStorage = (keys = []) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => {
            resolve(result);
        });
    });
};

const saveToStorage = (obj = {}) => {
    return chrome.storage.local.set(obj);
};

export { getFromStorage, saveToStorage };
