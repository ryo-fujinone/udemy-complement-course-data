const getFromManifest = (key) => {
    const manifest = chrome.runtime.getManifest();
    return manifest[key];
};

export { getFromManifest };
