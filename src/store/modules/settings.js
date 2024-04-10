import { createSlice } from "@reduxjs/toolkit";
import getDefaultSettings from "../../utils/defaultSettings";

const settingsSlice = createSlice({
    name: "settings",
    initialState: getDefaultSettings(),
    reducers: {
        updateSettings(state, { payload }) {
            const newSettings = payload.settings ?? {};
            return {
                ...state,
                ...newSettings,
            };
        },
        updateIsUfbEnabled(state, { payload }) {
            return {
                ...state,
                isUfbRelatedFeaturesEnabled: payload,
            };
        },
        updateUfbUrl(state, { payload }) {
            return {
                ...state,
                ufbUrl: payload,
            };
        },
        updateIsCacheEnabled(state, { payload }) {
            return {
                ...state,
                isCourseDataCacheEnabled: payload,
            };
        },
        updateCacheExpireHours(state, { payload }) {
            return {
                ...state,
                cacheExpireHours: payload,
            };
        },
    },
});

const {
    updateSettings,
    updateIsUfbEnabled,
    updateUfbUrl,
    updateIsCacheEnabled,
    updateCacheExpireHours,
} = settingsSlice.actions;

export {
    updateCacheExpireHours,
    updateIsCacheEnabled,
    updateIsUfbEnabled,
    updateSettings,
    updateUfbUrl,
};
export default settingsSlice.reducer;
