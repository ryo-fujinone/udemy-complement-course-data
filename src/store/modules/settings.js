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
        updateShouldWaitFor(state, { payload }) {
            return {
                ...state,
                shouldWaitForShareBtnInUfb: payload,
            };
        },
        updateWaitingTimeForPageNumChange(state, { payload }) {
            return {
                ...state,
                waitingTimeForPageNumChange: payload,
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
    updateShouldWaitFor,
    updateWaitingTimeForPageNumChange,
    updateIsCacheEnabled,
    updateCacheExpireHours,
} = settingsSlice.actions;

export {
    updateSettings,
    updateIsUfbEnabled,
    updateUfbUrl,
    updateShouldWaitFor,
    updateWaitingTimeForPageNumChange,
    updateIsCacheEnabled,
    updateCacheExpireHours,
};
export default settingsSlice.reducer;
