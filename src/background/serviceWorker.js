import { getFromStorage, saveToStorage } from "../utils/handleStorage";
import getDefaultSettings from "../utils/defaultSettings";

const updateSettings = async () => {
    const result = await getFromStorage(["settings"]);
    const settings = result.settings ?? {};
    const defaultSettings = getDefaultSettings();
    const mergedSettings = { ...defaultSettings, ...settings };
    const mergedSettingsKeys = Object.keys(mergedSettings);
    const newSettings = mergedSettingsKeys.reduce((obj, key) => {
        if (defaultSettings.hasOwnProperty(key)) {
            obj[key] = mergedSettings[key];
        }
        return obj;
    }, {});
    await saveToStorage({ settings: newSettings });
};

chrome.runtime.onInstalled.addListener(async () => {
    await updateSettings();
});
