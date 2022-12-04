import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import styled from "styled-components";

import UfbCourses from "../components/pages/UfbCourses";
import store from "../store";
import { fetchTaughtCouses } from "../store/modules/ufbCourses";

const StyledDiv = styled.div`
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #ddd;
`;

const App = ({ userId }) => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(fetchTaughtCouses(userId));
    }, []);

    return (
        <StyledDiv>
            <UfbCourses />
        </StyledDiv>
    );
};

const getUserId = () => {
    const profileElem = document.querySelector(
        "[data-module-id='user-profile']"
    );
    if (!profileElem) return null;

    const profileJson = profileElem.dataset.moduleArgs;
    if (!profileJson) return null;

    const profile = JSON.parse(profileJson);
    const userId = profile.user.id;
    return userId;
};

const addCrxRoot = (targetElem, userId) => {
    document.querySelector("#crx-root")?.remove();

    const root = document.createElement("div");
    root.id = "crx-root";
    targetElem.append(root);

    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <Provider store={store}>
                <App userId={userId} />
            </Provider>
        </React.StrictMode>
    );
};

const main = () => {
    const userId = getUserId();
    if (!userId) return;

    const profileRight = document.querySelector(
        "[class*='main-route--profile-right--']"
    );
    if (!profileRight) return;

    addCrxRoot(profileRight, userId);
};

(() => {
    if (window.location.host === "www.udemy.com") return;
    main();
})();
