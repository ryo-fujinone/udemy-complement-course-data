const getMessage = (key = "") => {
    const message = chrome.i18n.getMessage(key);
    return message !== "" ? message : key;
};

export { getMessage };
