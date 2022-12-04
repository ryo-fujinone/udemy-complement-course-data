import { createSlice } from "@reduxjs/toolkit";

import { generateTaughtCousesPathApiUrl } from "../../utils/generateUrl";
import { fetchData } from "../../utils/handleApi";

const ufbCoursesSlice = createSlice({
    name: "ufbCourses",
    initialState: [],
    reducers: {
        updateState(_, { payload = [] }) {
            return payload;
        },
    },
});

const { updateState } = ufbCoursesSlice.actions;

const fetchTaughtCouses = (userId = "0") => {
    return async (dispatch) => {
        const url = generateTaughtCousesPathApiUrl(userId);
        const data = await fetchData(url);
        if (data.count === undefined) return;

        const results = data.results;
        const filteredResults = results.filter((result) => {
            return result.is_in_any_ufb_content_collection;
        });
        dispatch(updateState(filteredResults));
    };
};

export { fetchTaughtCouses };
export default ufbCoursesSlice.reducer;
