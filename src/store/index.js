import { configureStore } from "@reduxjs/toolkit";

import settingsReducer from "./modules/settings";
import ufbCoursesReducer from "./modules/ufbCourses";
import saveSettings from "./middleware/saveSettings";

export default configureStore({
    reducer: {
        settings: settingsReducer,
        ufbCourses: ufbCoursesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(saveSettings),
});
