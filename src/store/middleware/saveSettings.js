import { saveToStorage } from "../../utils/handleStorage";

const saveSettings = (store) => {
    return (next) => {
        return async (action) => {
            next(action);

            if (!action.type.includes("settings/")) return;

            if (action.payload?.mes !== "restore") {
                const settings = store.getState().settings;
                await saveToStorage({ settings });
            }
        };
    };
};

export default saveSettings;
