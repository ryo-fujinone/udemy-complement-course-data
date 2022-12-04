const getFromManifet = (key) => {
    const manifest = chrome.runtime.getManifest();
    return manifest[key];
};

export { getFromManifet };
